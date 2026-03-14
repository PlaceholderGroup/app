import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet } from "react-native";

export default function Button() {
    return (
        <Pressable style={styles.button}>
            <MaterialIcons name="phone" size={24} color="white"/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        display: "flex",
        padding: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 20,
        backgroundColor: "#000000",
        alignSelf: "flex-start",
        margin: "auto",
    },
    buttonContent: {
        color: "#ffffff",
        fontSize: 24,
    }
})
