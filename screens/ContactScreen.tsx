import Avatar from "@/components/Avatar";
import PhoneNumbers from "@/components/PhoneNumbers";
import { Button, StyleSheet, Text, View } from "react-native";
import { HCESession, NFCTagType4, NFCTagType4NDEFContentType } from "react-native-hce";

import * as Contacts from "expo-contacts";
import { File, Paths } from "expo-file-system";

async function shareContact(contact: Contacts.ExistingContact) {
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

    let session: HCESession | undefined;

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


export default function ContactScreen({ contact }: { contact: Contacts.ExistingContact }) {
    return (
        <>
            <View style={styles.head}>
                {
                    (contact) &&
                    <>
                        <Avatar source={contact.image?.uri} size={192} name={contact.name} />
                        <Text style={styles.name}>{contact.name}</Text>
                    </>
                }
            </View>
            <View style={styles.main}>
                {
                    (contact?.phoneNumbers) &&
                    <PhoneNumbers phoneNumbers={contact.phoneNumbers} />
                }
                <Button title="Share Contact" onPress={() => shareContact(contact)} />
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 20,
        gap: 20,
        // NOTE: This background color comes from the default tabs navigator (I think) a similar default color is "whitesmoke" 
        // although I'm sure at some point we will want to come in with our own colors
        backgroundColor: "rgb(242, 242, 242)",
    },
    head: {
        alignItems: "center",
        gap: 20,
        backgroundColor: "white",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "lightgray",
    },
    avatar: {
        width: 192,
        height: 192,
        borderRadius: 96,
    },
    name: {
        fontSize: 36,
        fontWeight: 500,
    }
});