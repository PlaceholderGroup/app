import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo } from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface QuickShareDeviceProps extends PressableProps {
    device: string;
    connectionType?: "bluetooth" | "wifi";
}

const QuickShareDevice = memo(({ device, connectionType = "bluetooth", ...rest }: QuickShareDeviceProps) => {
    return (
        <Pressable style={({ pressed }) => [
            styles.container,
            pressed && styles.pressed,
        ]} {...rest}>
            <Text style={styles.label}>{device}</Text>
            <MaterialIcons name={connectionType} size={24} />
        </Pressable>
    );
});

export default QuickShareDevice;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        gap: 10,
        alignSelf: "stretch",
        borderTopWidth: 1,
        borderColor: "#CCCCCC",
    },
    label: {
        fontFamily: "Lexend_400Regular",
        fontWeight: 400,
        flexGrow: 1,
        fontSize: 14,
    },
    pressed: {
        backgroundColor: "rgba(0.0, 0.0, 0.0, 0.05)",
    },
});