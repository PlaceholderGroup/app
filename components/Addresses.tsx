import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";

import AddressIcon from "./ContactDetailIcons/AddressIcon";
import ThreeDotsIcon from "./ContactDetailIcons/ThreeDotsIcon";

export default function Addresses({ addresses }: { addresses?: Contacts.Address[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.addressContainer}>
                {
                    addresses?.map((address) => (
                        <View key={address.id} style={styles.addressItem}>
                            <View style={styles.addressIcon}>
                                <AddressIcon/>
                            </View>

                            <View style={styles.addressDetails}>
                                <Text key={address.id} style={styles.addressBox}>{address.street}</Text>
                                <Text style={styles.addressType}>{address.label}</Text>
                            </View>

                            <View style={styles.addressLabels}>
                                <View style={styles.addressProfileLogos}>
                                    {/* TODO: profile icons this address is linked to */}
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
    addressContainer: {
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
    addressItem: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: 20,
        alignSelf: "stretch",
    },
    addressIcon: {
        width: 24,
        height: 24,
        aspectRatio: 1/1,
    },
    addressDetails: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1,
    },
    addressLabels: {
        gap: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    addressBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    addressType: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    addressProfileLogos: {
        gap: -8,
        alignItems: "flex-start",
    }
})