import { HCESession, NFCTagType4, NFCTagType4NDEFContentType } from "@placeholdergroup/react-native-hce";

import * as Contacts from "expo-contacts";
import { toVCard } from "./contacts";

let session: HCESession | undefined;

async function startSharing(contact: Contacts.ExistingContact) {
    if (!session?.enabled && contact) {
        const vcf = toVCard(contact);

        const tag = new NFCTagType4({
            type: NFCTagType4NDEFContentType.MIME,
            mimeType: "text/vcard",
            content: vcf,
            writable: false,
        });

        session = await HCESession.getInstance();
        session.setApplication(tag);
        await session.setEnabled(true);
    }
}

async function stopSharing() {
    await session?.setEnabled(false);
}

export default {
    startSharing,
    stopSharing
};