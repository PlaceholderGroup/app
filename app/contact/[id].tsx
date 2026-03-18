import ContactScreen from "@/screens/ContactScreen";
import { getContact } from "@/utils/contacts";
import * as Contacts from "expo-contacts";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Contact() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [contact, setContact] = useState<Contacts.ExistingContact>();

    useEffect(() => {
        getContact(id, setContact);
    }, [id]);

    return (
        <View style={styles.body}>
            {(contact) && <ContactScreen contact={contact} />}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
});