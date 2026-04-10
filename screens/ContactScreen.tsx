import Addresses from "@/components/Addresses";
import Dates from "@/components/Dates";
import Emails from "@/components/Emails";
import PhoneNumbers from "@/components/PhoneNumbers";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import ProfileCarousel from "@/components/ProfileCarousel";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import { ContactsContext } from "@/contexts/ContactsContext";
import { ProfilesContext } from "@/contexts/ProfilesContext";
import DBHelper from "@/database/DBHelper";
import { deduplicate } from "@/utils/contacts";
import { retryUntilTrue } from "@/utils/hacks";
import { openLink } from "@/utils/link";
import * as Contacts from "expo-contacts";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";

export default function ContactScreen({ contact }: { contact: Contacts.ExistingContact }) {
    const router = useRouter();

    const { setCurrentContact } = useContext(ContactsContext);
    const { profiles, setProfiles } = useContext(ProfilesContext);

    // const [profiles, setProfiles] = useState<profileObj[]>([]);
    const [profileIndex, setProfileIndex] = useState<number>(0);

    useEffect(() => {
        (async () => {
            await retryUntilTrue(() => DBHelper.getDBStatus());
            const profileList = await DBHelper.getAllProfileObjs(contact.id);
            profileList.forEach(profile => {
                if (profile.contact !== undefined) {
                    profile.contact = deduplicate(profile.contact);
                    if (profile.contact.image === undefined) {
                        profile.contact.image = { uri: profile.picture_link }
                    }
                    else {
                        profile.contact.image.uri = profile.picture_link;
                    }
                }
            });
            setProfiles(profileList);
        })();
    }, [contact]);

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
                        (profiles[profileIndex]?.contact) &&
                        <>
                            <ProfileCarousel profiles={profiles} setProfileIndex={setProfileIndex} />
                            <Text style={styles.name}>{profiles[profileIndex]?.contact.name}</Text>

                            {/* TODO: These need to be based on the primary phone/email, not just the first one. */}
                            <View style={styles.buttons}>
                                <Button icon="phone" disabled={!profiles[profileIndex]?.contact.phoneNumbers} onPress={() => {
                                    profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number && openLink(profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number, "tel");
                                }} />
                                <Button icon="chat-bubble" disabled={!profiles[profileIndex]?.contact.phoneNumbers} onPress={() => {
                                    profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number && openLink(profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number, "sms");
                                }} />
                                <Button icon="videocam" disabled={!profiles[profileIndex]?.contact.phoneNumbers} onPress={() => {
                                    profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number && openLink(profiles[profileIndex]?.contact.phoneNumbers?.[0]?.number, "video");
                                }} />
                                <Button icon="email" disabled={!profiles[profileIndex]?.contact.emails} onPress={() => {
                                    profiles[profileIndex]?.contact.emails?.[0]?.email && openLink(profiles[profileIndex]?.contact.emails?.[0]?.email, "email");
                                }} />
                            </View>
                            <Button title="Share Contact" icon="share" type="tertiary" style={styles.shareButton} onPress={() => {
                                router.navigate({
                                    pathname: "/share/[id]",
                                    params: {
                                        id: contact.id,
                                        profileId: profiles[profileIndex]?.profile_id,
                                    }
                                })
                            }} />
                        </>
                    }
                </View>
                <View style={styles.main}>
                    {
                        (profiles[profileIndex]?.contact?.phoneNumbers) &&
                        <PhoneNumbers phoneNumbers={profiles[profileIndex]?.contact.phoneNumbers} />
                    }
                    {
                        (profiles[profileIndex]?.contact?.emails) &&
                        <Emails emails={profiles[profileIndex]?.contact.emails} />
                    }
                    {
                        (profiles[profileIndex]?.contact?.birthday || profiles[profileIndex]?.contact?.dates) &&
                        <Dates birthday={profiles[profileIndex]?.contact.birthday} dates={profiles[profileIndex]?.contact.dates} />
                    }
                    {
                        (profiles[profileIndex]?.contact?.addresses) &&
                        <Addresses addresses={profiles[profileIndex]?.contact.addresses} />
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
    },
});