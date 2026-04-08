import Avatar from "@/components/Avatar";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import DBHelper, { profileObj } from "@/database/DBHelper";
import { toVCard } from "@/utils/contacts";
import { retryUntilTrue } from "@/utils/hacks";
import NFC from "@/utils/NFC";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import QRCode from "react-qr-code";


export default function Sharing() {
    const { id, profileId } = useLocalSearchParams<{ id: string, profileId: string }>();
    const [profile, setProfile] = useState<profileObj>();


    useEffect(() => {
        (async () => {
            await retryUntilTrue(() => DBHelper.getDBStatus());
            const profile = await DBHelper.getProfileObj(id, Number(profileId));
            if (profile) {
                if (profile.name !== "Stock" && profile.picture_link !== "") {
                    profile.contact.image = { uri: profile.picture_link };
                }
                setProfile(profile);
            }
        })();
    }, [id, profileId]);

    useEffect(() => {
        if (Platform.OS === "android") {
            if (profile) {
                NFC.startSharing(profile.contact);
            }
        }

        return () => {
            if (Platform.OS === "android") NFC.stopSharing();
        }
    }, [profile]);

    return (
        // TODO: I don't like listing this manually here. That's what creating the TabsSafeAreaView component was supposed to avoid
        <TabsSafeAreaView edges={["bottom", "left", "right"]}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.sharingContainer}>
                    {profile?.contact &&
                        <View style={styles.contactPreview}>
                            <Avatar name={profile.contact.name} size={64} source={profile.contact.image?.uri} icon={profile.icon as keyof typeof MaterialIcons.glyphMap} />
                            <Text style={styles.previewText}>
                                Sharing <Text style={styles.namePreview}>{profile.contact.name}</Text>
                            </Text>
                        </View>
                    }
                    <View style={styles.qrContainer}>
                        {profile && <QRCode value={toVCard(profile.contact)} size={220} style={styles.qrContainer} />}
                    </View>
                    <View style={styles.sharePrompt}>
                        {Platform.OS === "android" && <MaterialIcons name="contactless" size={24} />}
                        <Text style={styles.previewText}>{Platform.select({ ios: "Scan", android: "Tap or scan" })} to receive</Text>
                    </View>

                </View>
            </ScrollView>
        </TabsSafeAreaView>
    )
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    sharingContainer: {
        display: "flex",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        alignSelf: "stretch",
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 0,
    },
    contactPreview: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    },
    previewText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Lexend_400Regular",
    },
    namePreview: {
        fontWeight: 500,
        fontFamily: "Lexend_500Medium",
    },
    qrContainer: {
        width: 250,
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        aspectRatio: "1/1",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        borderRadius: 10,
    },
    sharePrompt: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    },
    quickShare: {
        display: "flex",
        padding: 20,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 20,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 0,
        alignSelf: "stretch",
        borderTopWidth: 1,
        borderColor: "#CCCCCC",
        backgroundColor: "rgba(255, 255, 255, 0.50)",
    },
    quickShareText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        alignSelf: "stretch",
    },
    quickShareLabel: {
        fontFamily: "Lexend_400Regular",
        fontSize: 20,
        fontWeight: 400,
    },
    quickSharePrompt: {
        fontFamily: "Lexend_300Light",
        fontSize: 14,
        fontWeight: 300,
    },
})