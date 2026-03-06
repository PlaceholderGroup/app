import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";

export default function PhoneNumbers({ phoneNumbers }: { phoneNumbers?: Contacts.PhoneNumber[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Phone Numbers</Text>
            <View style={styles.phoneNumbers}>
                {
                    phoneNumbers?.map((phoneNumber) => (
                        <Text key={phoneNumber.id} style={styles.number}>{phoneNumber.number}</Text>
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
        padding: 10,
    },
    number: {
        padding: 5,
    },
    phoneNumbers: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "white",
        overflow: "hidden",
        padding: 10,
        gap: 10,
    }
})