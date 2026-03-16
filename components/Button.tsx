import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface ButtonProps extends PressableProps {
    icon?: keyof typeof MaterialIcons.glyphMap,
    type?: "primary" | "secondary" | "tertiary",
    title?: string,
}

export default function Button({ icon, type = "primary", title, disabled, style, ...rest }: ButtonProps) {
    return (
        <Pressable style={({ hovered, pressed }) => [
            styles.button,
            buttonStyles[type].button,
            pressed && buttonStyles[type].pressed,
            disabled && buttonStyles[type].disabled,
            typeof style === "function" ? style({ hovered, pressed }) : style,
        ]} disabled={disabled} {...rest}>
            {(icon) && <MaterialIcons name={icon} size={24} style={[
                buttonStyles[type].content,
                disabled && buttonStyles[type].disabledContent,
            ]} />}
            {(title) && <Text style={[
                buttonStyles[type].content,
                buttonStyles[type].title,
                disabled && buttonStyles[type].disabledContent,
            ]}>{title}</Text>}
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
        alignSelf: "flex-start",
        minHeight: 56,
        minWidth: 56,
    },
})

const buttonStyles = {
    primary: StyleSheet.create({
        button: {
            backgroundColor: "#000000",
        },
        content: {
            color: "#ffffff",
        },
        title: {
            fontFamily: "Lexend_500Medium",
            fontSize: 20,
        },
        pressed: {
            backgroundColor: "#191919",
        },
        disabled: {
            backgroundColor: "#808080",
        },
        disabledContent: {},
    }),
    secondary: StyleSheet.create({
        button: {
            backgroundColor: "transparent",
            borderColor: "#000000",
            borderWidth: 2,
        },
        content: {
            color: "#000000"
        },
        title: {
            fontFamily: "Lexend_500Medium",
            fontSize: 20,
        },
        pressed: {
            backgroundColor: "#0000000D"
        },
        disabled: {
            borderColor: "#808080",
        },
        disabledContent: {
            color: "#808080",
        },
    }),
    tertiary: StyleSheet.create({
        button: {
            backgroundColor: "transparent",
        },
        content: {
            color: "#000000"
        },
        title: {
            fontFamily: "Lexend_500Medium",
            fontSize: 20,
        },
        pressed: {
            backgroundColor: "#0000000D"
        },
        disabled: {},
        disabledContent: {
            color: "#808080",
        },
    }),
}
