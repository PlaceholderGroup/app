import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";

import EmailIcon from "./ContactDetailIcons/EmailIcon";
import ThreeDotsIcon from "./ContactDetailIcons/ThreeDotsIcon";

export default function Emails({ emails }: { emails?: Contacts.Email[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.emailContainer}>
                {
                    emails?.map((email) => (
                        <View key={email.id} style={styles.emailItem}>
                            <View style={styles.emailIcon}>
                                <EmailIcon/>
                            </View>

                            <View style={styles.emailDetails}>
                                <Text key={email.id} style={styles.emailBox}>{email.email}</Text>
                                <Text style={styles.emailType}>{email.label}</Text>
                            </View>

                            <View style={styles.emailLabels}>
                                <View style={styles.emailProfileLogos}>
                                    {/* TODO: profile icons this email is linked to */}
                                </View>
                                <ThreeDotsIcon/>
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
    emailContainer: {
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
    emailItem: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: 20,
        alignSelf: "stretch",
    },
    emailIcon: {
        width: 24,
        height: 24,
        aspectRatio: 1/1,
    },
    emailDetails: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1,
    },
    emailLabels: {
        gap: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    emailBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 16 * 1.15,
    },
    emailType: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    emailProfileLogos: {
        gap: -8,
        alignItems: "flex-start",
    }
})