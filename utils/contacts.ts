import DBHelper from "@/database/DBHelper";
import * as Contacts from "expo-contacts";
import { retryUntilTrue } from "./hacks";

export const CONTACT_FIELDS = [
    Contacts.Fields.RawImage,
    Contacts.Fields.PhoneNumbers,
    Contacts.Fields.Emails,
    Contacts.Fields.Addresses,
    Contacts.Fields.Birthday,
    Contacts.Fields.SocialProfiles,
    Contacts.Fields.Dates
];

// const FILTER = [
//     "Business Bearcat",
//     "Dr. Bearcut",
//     "Ballet Bearcat",
//     "Chef Bearcat",
//     "Standard Bearcat",
//     "Graduation Bearcat",
//     "Anne Ning",
//     "Jack Detrick",
//     "Jonah Carter",
//     "Kevin Long",
//     "Mom",
// ]

export async function syncContacts() {
    const contacts = await getContacts() || [];

    // TODO: This is obviously bad.
    await retryUntilTrue(DBHelper.getDBStatus);

    try {
        const existing = (await DBHelper.getAllContacts() as any[]).map((contact: { contact_code: string }) => contact.contact_code);

        for (const contact of contacts) {
            if (contact.id && !existing.includes(contact.id)) {
                await DBHelper.createContactObj(contact);
                await DBHelper.createProfileObj(
                    contact.id,
                    "Stock",
                    "home",
                    contact.image?.uri || "",
                    [],
                );
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export function deduplicate(contact: Contacts.ExistingContact): Contacts.ExistingContact {
    function filterUnique(objects: any[] | undefined, toString: (object: any) => any): any[] | undefined {
        let seen = new Set();
        return objects?.filter((object) => {
            const value = toString(object);
            if (!seen.has(value)) {
                seen.add(value);
                return true;
            }
            return false;
        })
    }

    if (contact.phoneNumbers) {
        contact.phoneNumbers = filterUnique(
            contact.phoneNumbers,
            (phoneNumber) => `${phoneNumber.number?.replaceAll(/\D/gm, "")}:${phoneNumber.label}`
        );
    }

    if (contact.emails) {
        contact.emails = filterUnique(
            contact.emails,
            (email) => `${email.email}:${email.label}`
        );
    }

    if (contact.urlAddresses) {
        contact.urlAddresses = filterUnique(
            contact.urlAddresses,
            (urlAddress) => `${urlAddress.url}:${urlAddress.label}`
        );
    }

    if (contact.addresses) {
        contact.addresses = filterUnique(
            contact.addresses,
            (address) => `${address.poBox}:${address.street}:${address.city}:${address.region}:${address.postalCode}:${address.country}`
        );
    }

    if (contact.dates) {
        contact.dates = filterUnique(
            contact.dates,
            (date) => `${date.year}:${date.month}:${date.day}:${date.label}`
        );
    }

    if (contact.socialProfiles) {
        contact.socialProfiles = filterUnique(
            contact.socialProfiles,
            (socialProfile) => `${socialProfile.service}:${socialProfile.url}:${socialProfile.username}`
        );
    }

    if (contact.instantMessageAddresses) {
        contact.instantMessageAddresses = filterUnique(
            contact.instantMessageAddresses,
            (address) => `${address.service}:${address.username}`
        );
    }

    if (contact.relationships) {
        contact.relationships = filterUnique(
            contact.relationships,
            (relationship) => `${relationship.name}:${relationship.label}`
        );
    }

    return contact;
};

// TODO: The types on this are kind of ugly, I mostly just copied them from Intellisense type previews, they can probably be cleaned up
export async function getContact(
    userId: string,
    setContact?: React.Dispatch<React.SetStateAction<Contacts.ExistingContact | undefined>>
): Promise<void | Contacts.ExistingContact | undefined> {
    const data = await Contacts.getContactByIdAsync(userId, CONTACT_FIELDS);
    if (data) {
        setContact?.(data);
        return data;
    }
};

export async function getContacts(
    setContacts?: React.Dispatch<React.SetStateAction<Contacts.ExistingContact[]>>
): Promise<void | Contacts.ExistingContact[] | undefined> {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
            sort: Contacts.SortTypes.FirstName,
            fields: CONTACT_FIELDS
        });
        setContacts?.(data);
        return data;
    }
};

export function editContact(id: string | undefined) {
    if (id) {
        Contacts.presentFormAsync(id);
    }
};

// TODO: This is probably not the best way to do this
// TODO: Some of this is really inconsistent, i.e. TYPE vs type, etc.
// It feels messy which may just be a product of the use of non-standard properties
// but I may want to do a little more research/investigation here
// TODO: I also don't know that it is properly handling work, home, etc. distinctions
export function toVCard(contact: Contacts.ExistingContact): string {

    function escape(str: string | undefined): string {
        return str ? str.replaceAll(/([,;\\])/gm, "\\$1").replaceAll(/\n/gm, "\\n") : "";
    };

    function formatDate(date: Contacts.Date | undefined): string {
        if (date) {
            const MM = date.month !== undefined ? `${date.month + 1}`.padStart(2, "0") : "";
            const DD = date.day !== undefined ? `${date.day}`.padStart(2, "0") : "";

            if (date.year && MM && DD) return `${date.year}${MM}${DD}`;
            // NOTE: This seems weird, but I think it is just the way to distinguish 
            // between two digit years
            if (date.year && MM) return `${date.year}-${MM}`;
            if (date.year && !MM && !DD) return `${date.year}`;
            if (!date.year && MM && DD) return `--${date.month}${date.day}`;
            if (!date.year && !MM && DD) return `---${date.day}`;
        }

        return "";
    };

    function formatProperty(property: string, value: string | undefined | Array<string | undefined>): string {
        value = [value].flat();
        return `${property}:${value.map(escape).join(";")}`;
    };

    deduplicate(contact);

    // NOTE: I'm using v3.0 here because I don't know that most of the apps support v4.0 yet
    const vCard = [
        formatProperty("BEGIN", "VCARD"),
        formatProperty("VERSION", "3.0"),
    ];

    // Names
    // N, FN, NICKNAME
    vCard.push(
        formatProperty("N", [
            contact.lastName,
            contact.firstName,
            contact.middleName,
            contact.namePrefix,
            contact.nameSuffix
        ])
    );
    vCard.push(formatProperty("FN", contact?.name ||
        [
            contact.namePrefix,
            contact.firstName,
            contact.middleName,
            contact.lastName,
            contact.nameSuffix
        ].filter((x) => x !== undefined).join(" "))
    );
    // NOTE: Technically multiple nicknames can be defined but Expo doesn't seem to 
    // support this
    if (contact.nickname) vCard.push(formatProperty("NICKNAME", contact.nickname));

    // Phonetic names
    // X-PHONETIC-FIRST-NAME, X-PHONETIC-MIDDLE-NAME, X-PHONETIC-LAST-NAME
    if (contact.phoneticFirstName) vCard.push(formatProperty("X-PHONETIC-FIRST-NAME", contact.phoneticFirstName));
    if (contact.phoneticMiddleName) vCard.push(formatProperty("X-PHONETIC-MIDDLE-NAME", contact.phoneticMiddleName));
    if (contact.phoneticLastName) vCard.push(formatProperty("X-PHONETIC-LAST-NAME", contact.phoneticLastName));

    // Work details
    // ORG, TITLE
    if (contact.company) vCard.push(formatProperty("ORG", [
        contact.company,
        contact.department,
    ]));
    if (contact.jobTitle) vCard.push(formatProperty("TITLE", contact.jobTitle));

    // TODO: I really don't like how these next few properties are done

    // Phone numbers
    // TEL
    // TODO: Can we share primary information? Yes using X-Primary, also look into PREF and X-School etc.
    contact.phoneNumbers?.forEach((number) => {
        vCard.push(formatProperty(`TEL;TYPE=${number.label.toUpperCase()}`, number.number))
    });

    // Emails
    // EMAIL
    // TODO: Can we share primary information? Yes using X-Primary, also look into PREF and X-School etc.
    contact.emails?.forEach((email) => {
        vCard.push(formatProperty(`EMAIL;TYPE=${email.label.toUpperCase()}`, email.email))
    });

    // Links
    // URL
    // TODO: Can we share primary information? Yes using X-Primary, also look into PREF and X-School etc.
    contact.urlAddresses?.forEach((url) => {
        vCard.push(formatProperty(`URL;TYPE=${url.label.toUpperCase()}`, url.url))
    });

    // Addresses
    // ADR
    contact.addresses?.forEach((address) => {
        vCard.push(formatProperty(`ADR;TYPE=${address.label.toUpperCase()}`, [
            // NOTE: I included PO Box here since Expo does technically make it available 
            // but I think it is often just included elsewhere (see v4.0 spec)
            address.poBox,
            undefined,
            address.street,
            address.city,
            address.region,
            address.postalCode,
            address.country,
        ]));
    });

    // Dates
    // BDAY, X-ABDATE
    // TODO: I think I've got this right, but it's not showing up properly in my QR code 
    // test
    if (contact.birthday) vCard.push(formatProperty("BDAY", formatDate(contact.birthday)));
    contact.dates?.forEach((date) => {
        vCard.push(formatProperty(`X-ABDATE${date.label ? `;type=${date.label}` : ""}`, formatDate(date)));
    });

    // Social profiles
    // X-SOCIALPROFILE, IMPP
    // TODO: I don't actually know if these work
    contact.socialProfiles?.forEach((profile) => {
        vCard.push(
            formatProperty(
                `X-SOCIALPROFILE;TYPE=${escape(profile.service)}`,
                profile.url || profile.username
            )
        );
    });
    contact.instantMessageAddresses?.forEach((address) => {
        vCard.push(formatProperty(`IMPP:${escape(address.service)}`, address.username))
    });

    // Relationships
    // X-ABRELATEDNAMES
    contact.relationships?.forEach((relationship) => {
        vCard.push(
            formatProperty(
                `X-ABRELATEDNAMES;type=${escape(relationship.label)}`,
                relationship.name
            )
        );
    });

    // Image
    // PHOTO
    // NOTE: This will not work in QR codes, or likely NFC
    // TODO: Compress image and add logic to get an image from a file
    if (contact.image && contact.image.base64) {
        vCard.push(formatProperty(
            "PHOTO;TYPE=JPEG;ENCODING=b",
            contact.image.base64
        ))
    }

    if (contact.note) vCard.push(formatProperty("NOTE", contact.note));

    vCard.push("END:VCARD");
    return vCard.join("\n");
};
