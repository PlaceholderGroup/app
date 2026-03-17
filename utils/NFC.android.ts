import { File, Paths } from "expo-file-system";
import { HCESession, NFCTagType4, NFCTagType4NDEFContentType } from "react-native-hce";

import * as Contacts from "expo-contacts";

let session: HCESession | undefined;



export async function shareContact(contact: Contacts.ExistingContact) {
        // console.log(contact);

        // let result = false;

        // try {
        //     await NfcManager.requestTechnology(NfcTech.Ndef);

        //     const bytes = Ndef.encodeMessage([Ndef.textRecord("Hello NFC!")]);

        //     if (bytes) {
        //         await NfcManager.ndefHandler.writeNdefMessage(bytes);
        //         result = true;
        //     }
        // } catch (error) {
        //     console.log(error);
        // } finally {
        //     NfcManager.cancelTechnologyRequest();
        // }

        // console.log(result);

        // return result;

        console.log(session?.enabled);
        if (!session?.enabled) {

            const uri = await Contacts.writeContactToFileAsync({
                id: contact.id,
            });

            console.log(uri);

            if (uri) {
                const file = new File(Paths.cache, `${contact.id}.vcf`);

                // TODO: I know it won't work exactly as we want right now, but I want to get the actual vCard to transmit as 
                // text, the new Expo FileSystem API is just giving me a little trouble right now


                console.log("Starting share!")
                const tag = new NFCTagType4({
                    type: NFCTagType4NDEFContentType.Text,
                    content: JSON.stringify(contact),
                    writable: false,
                });



                session = await HCESession.getInstance();
                session.setApplication(tag);
                await session.setEnabled(true);
                console.log("Share ready!");
            }

        } else {
            console.log("Stopping!")
            await session.setEnabled(false);
        }
}