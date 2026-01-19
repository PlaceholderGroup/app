import ContactScreen from "@/screens/ContactScreen";
import * as Contacts from "expo-contacts";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Contact() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [contact, setContact] = useState<Contacts.Contact>();

    function getContact(userId: string) {
        Contacts.getContactByIdAsync(userId, [Contacts.Fields.RawImage, Contacts.Fields.PhoneNumbers])
            .then((data) => {
                if (data) {
                    setContact(data);
                }
            });
    }

    useEffect(() => {
        getContact(id);
    }, [id]);

    return (
        <SafeAreaView style={styles.body}>
            {(contact) && <ContactScreen contact={contact} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});