import Avatar from "@/components/Avatar";
import PhoneNumbers from "@/components/PhoneNumbers";
import { StyleSheet, Text, View } from "react-native";


import * as Contacts from "expo-contacts";


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
                    (contact) &&
                    <PhoneNumbers phoneNumbers={contact.phoneNumbers} />
                }
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    main: {
        flex: 1,
        padding: 20,
        gap: 20
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