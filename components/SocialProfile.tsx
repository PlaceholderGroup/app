import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";


export default function SocialProfiles({ socialProfiles }: { socialProfiles?: Contacts.SocialProfile[] }) {

    const getIconName = (service?: string) => {
        if (!service) return "sms";
        const normalized = service.toLowerCase();
        if (normalized.includes("discord")) return "discord";
        if (normalized.includes("duo") && !normalized.includes("duolingo")) return "duo";
        if (normalized.includes("paypal")) return "paypal";
        if (normalized.includes("youtube")) return "play-circle";
        if (normalized.includes("quora")) return "quora";
        if (normalized.includes("reddit")) return "reddit";
        if (normalized.includes("tiktok")) return "tiktok";
        if (normalized.includes("steam")) return "videogame-asset";
        if (normalized.includes("wechat")) return "wechat";
        if (normalized.includes("wordpress")) return "wordpress";
        return "sms";
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Social Profile</Text>
            <View style={styles.socialProfileContainer}>
                {
                    socialProfiles?.map((socialProfile) => (
                        <View key={socialProfile.id} style={styles.socialProfileItem}>
                            <View style={styles.socialProfileIcon}>
                                <MaterialIcons name={getIconName(socialProfile.service)} size={24} />
                            </View>

                            <View style={styles.socialProfileDetails}>
                                <Text key={socialProfile.id} style={styles.socialProfileBox}>{socialProfile.username} ({socialProfile.service})</Text>
                                <Text style={styles.socialProfileType}>{socialProfile.label}</Text>
                            </View>

                            <View style={styles.socialProfileLabels}>
                                <View style={styles.socialProfileProfileLogos}>
                                    {/* TODO: profile icons this socialProfile is linked to */}
                                </View>
                                <MaterialIcons name="more-vert" size={24}/>
                            </View>
                        </View>
                    ))
                }
            </View>
        </View>
    );
}

// NOTE: These styles are by no means final.

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontWeight: 500,
        fontSize: 20,
        padding: 10,
    },
    socialProfileContainer: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "white",
        overflow: "hidden",
        padding: 10,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingVertical: 25,
        paddingHorizontal: 20,
        gap: 20,
        alignSelf: "stretch",
    },
    socialProfileItem: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: 20,
        alignSelf: "stretch",
    },
    socialProfileIcon: {
        width: 24,
        height: 24,
        aspectRatio: 1/1,
    },
    socialProfileDetails: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1,
    },
    socialProfileLabels: {
        gap: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    socialProfileBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 16 * 1.15,
    },
    socialProfileType: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    socialProfileProfileLogos: {
        gap: -8,
        alignItems: "flex-start",
    }
})