import ContactScreen from "@/screens/ContactScreen";
import { getContact } from "@/utils/contacts";
import * as Contacts from "expo-contacts";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";

export default function Contact() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [contact, setContact] = useState<Contacts.ExistingContact>();

    const appState = useRef(AppState.currentState);


    useEffect(() => {
        getContact(id, setContact);
    }, [id]);

    // TODO: This won't work if we end up getting our own edit contact functionality, 
    // but for now it's fine
    // TODO: I also don't like that it is duplicated over 3 different files
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                getContact(id, setContact);
            }

            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    }, []);

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