import PhoneNumbers from "@/components/PhoneNumbers";
import { Button, StyleSheet, Text, View } from "react-native";

import ProfileCarousel from "@/components/ProfileCarousel";
import * as Contacts from "expo-contacts";
import { shareContact } from "./NFC";

// if (Platform.OS === "android") {
// }


export default function ContactScreen({ contact }: { contact: Contacts.ExistingContact }) {
    return (
        <>
            <View style={styles.head}>
                {
                    (contact) &&
                    <>
                        <ProfileCarousel contact={contact} />
                        <Text style={styles.name}>{contact.name}</Text>
                    </>
                }
            </View>
            <View style={styles.main}>
                {
                    (contact?.phoneNumbers) &&
                    <PhoneNumbers phoneNumbers={contact.phoneNumbers} />
                }
                <Button title="Share Contact" onPress={() => shareContact(contact)}  />
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
        paddingTop: 20,
        paddingBottom: 20,
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