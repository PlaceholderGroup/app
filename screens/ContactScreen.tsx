import Avatar from "@/components/Avatar";
import PhoneNumbers from "@/components/PhoneNumbers";
import { Button, StyleSheet, Text, View } from "react-native";
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';


import * as Contacts from "expo-contacts";

async function shareContact(contact: Contacts.Contact) {
    console.log(contact);

    let result = false;

    try {
        await NfcManager.requestTechnology(NfcTech.Ndef);

        const bytes = Ndef.encodeMessage([Ndef.textRecord("Hello NFC!")]);

        if (bytes) {
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
            result = true;
        }
    } catch (error) {
        console.log(error);
    } finally {
        NfcManager.cancelTechnologyRequest();
    }

    console.log(result);

    return result;
}


export default function ContactScreen({ contact }: { contact: Contacts.Contact }) {
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