import { Pressable, StyleSheet } from "react-native";

export default function Button() {
    return (
        <Pressable style={styles.button}>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
})
