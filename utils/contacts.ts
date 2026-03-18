import * as Contacts from "expo-contacts";

export const CONTACT_FIELDS = [
    Contacts.Fields.RawImage,
    Contacts.Fields.PhoneNumbers,
    Contacts.Fields.Emails,
    Contacts.Fields.Addresses,
    Contacts.Fields.Birthday,
    Contacts.Fields.SocialProfiles
]

// TODO: The types on this are kind of ugly, I mostly just copied them from Intellisense type previews, they can probably be cleaned up
export async function getContact(
    userId: string,
    setContact: React.Dispatch<React.SetStateAction<Contacts.ExistingContact | undefined>>
): Promise<void | Contacts.ExistingContact | undefined> {
    const data = await Contacts.getContactByIdAsync(userId, CONTACT_FIELDS);
    if (data) {
        setContact(data);
    }
}