import Avatar from "@/components/Avatar";
import PhoneNumbers from "@/components/PhoneNumbers";
import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import * as Contacts from "expo-contacts";
import { shareContact } from "./NFC";


export default function ContactScreen({ contact }: { contact: Contacts.ExistingContact }) {
    return (
        <>
            <View style={styles.head}>
                {
                    (contact) &&
                    <>
                        <Avatar source={contact.image?.uri} size={192} name={contact.name} />
                        <Text style={styles.name}>{contact.name}</Text>
                        <View style={styles.buttons}>
                            <Button icon="phone" />
                            <Button icon="chat-bubble" />
                            <Button icon="videocam" />
                            <Button icon="email" />
                        </View>
                        <Button title="Share Contact" icon="share" type="tertiary" style={styles.shareButton} onPress={() => shareContact(contact)}  />
                    </>
                }
            </View>
            <View style={styles.main}>
                {
                    (contact?.phoneNumbers) &&
                    <PhoneNumbers phoneNumbers={contact.phoneNumbers} />
                }
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
        fontSize: 32,
        fontWeight: 500,
        fontFamily: "Lexend_500Medium",
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 20,
        alignSelf: "stretch",
    },
    shareButton: {
        alignSelf: "stretch"
    },
});