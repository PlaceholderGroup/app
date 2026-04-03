import Addresses from "@/components/Addresses";
import Dates from "@/components/Dates";
import Emails from "@/components/Emails";
import PhoneNumbers from "@/components/PhoneNumbers";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import ProfileCarousel from "@/components/ProfileCarousel";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import { ContactsContext } from "@/contexts/ContactsContext";
import { openLink } from "@/utils/link";
import * as Contacts from "expo-contacts";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext } from "react";


export default function ContactScreen({ contact }: { contact: Contacts.ExistingContact }) {
    const router = useRouter();

    const { setCurrentContact } = useContext(ContactsContext);

    useFocusEffect(
        useCallback(() => {
            setCurrentContact(contact.id);
            return () => setCurrentContact(undefined);
        }, [contact.id])
    );

    return (
        <TabsSafeAreaView style={{ flex: 1 }} >
            <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                <View style={styles.head}>
                    {
                        (contact) &&
                        <>
                            <ProfileCarousel contact={contact} />
                            <Text style={styles.name}>{contact.name}</Text>

                            {/* TODO: These need to be based on the primary phone/email, not just the first one. */}
                            <View style={styles.buttons}>
                                <Button icon="phone" disabled={!contact.phoneNumbers} onPress={() => {
                                    contact.phoneNumbers?.[0]?.number && openLink(contact.phoneNumbers?.[0]?.number, "tel");
                                }} />
                                <Button icon="chat-bubble" disabled={!contact.phoneNumbers} onPress={() => {
                                    contact.phoneNumbers?.[0]?.number && openLink(contact.phoneNumbers?.[0]?.number, "sms");
                                }} />
                                <Button icon="videocam" disabled={!contact.phoneNumbers} onPress={() => {
                                    contact.phoneNumbers?.[0]?.number && openLink(contact.phoneNumbers?.[0]?.number, "video");
                                }} />
                                <Button icon="email" disabled={!contact.emails} onPress={() => {
                                    contact.emails?.[0]?.email && openLink(contact.emails?.[0]?.email, "email");
                                }} />
                            </View>
                            <Button title="Share Contact" icon="share" type="tertiary" style={styles.shareButton} onPress={() => {
                                router.navigate({
                                    pathname: "/share/[id]",
                                    params: {
                                        id: contact.id,
                                    }
                                })
                            }} />
                        </>
                    }
                </View>
                <View style={styles.main}>
                    {
                        (contact?.phoneNumbers) &&
                        <PhoneNumbers phoneNumbers={contact.phoneNumbers} />
                    }
                    {
                        (contact?.emails) &&
                        <Emails emails={contact.emails} />
                    }
                    {
                        (contact?.birthday || contact?.dates) &&
                        <Dates birthday={contact.birthday} dates={contact.dates} />
                    }
                    {
                        (contact?.addresses) &&
                        <Addresses addresses={contact.addresses} />
                    }
                </View>
            </ScrollView>
        </TabsSafeAreaView>

    );
}

const styles = StyleSheet.create({
    main: {
        padding: 20,
        paddingTop: 10,
        gap: 20,
        // NOTE: This background color comes from the default tabs navigator (I think) a similar default color is "whitesmoke" 
        // although I'm sure at some point we will want to come in with our own colors
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
        alignSelf: "stretch",
        paddingBottom: 0,
        // backgroundColor: "#000", // For testing
    },
});