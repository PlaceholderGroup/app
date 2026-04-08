import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";


export default function PhoneNumbers({ phoneNumbers }: { phoneNumbers?: Contacts.PhoneNumber[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.phoneNumbers}>
                {
                    phoneNumbers?.map((phoneNumber) => (
                        <View key={phoneNumber.id} style={styles.phoneItem}>
                            <View style={styles.phoneIcon}>
                                <MaterialIcons name="phone" size={24}/>
                            </View>

                            <View style={styles.phoneDetails}>
                                <Text key={phoneNumber.id} style={styles.phoneNumBox}>{phoneNumber.number}</Text>
                                <Text style={styles.phoneTypeBox}>{phoneNumber.label}</Text>
                            </View>

                            <View style={styles.phoneLabels}>
                                <View style={styles.phoneProfileLogos}>
                                    {/* TODO: profile icons this number is linked to */}
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
    phoneNumbers: {
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
    phoneItem: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: 20,
        alignSelf: "stretch",
        //backgroundColor: "#6c99c2", // For testing
    },
    phoneIcon: {
        width: 24,
        height: 24,
        aspectRatio: 1/1,
    },
    phoneDetails: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1,
    },
    phoneLabels: {
        gap: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    phoneNumBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    phoneTypeBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    phoneProfileLogos: {
        gap: -8,
        alignItems: "flex-start",
    }
})