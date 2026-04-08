import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, ImageStyle } from "expo-image";
import { DimensionValue, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const colors = ["red", "green", "blue"] as const;

function getColor(name: string): "red" | "green" | "blue" {
    const index = [...name].reduce((sum, character) => sum += character.charCodeAt(0), 0) % colors.length
    return colors[index];
}

export default function Avatar({ name, size, source, icon, style, ...rest }: { name: string, size: DimensionValue, source?: string, icon?: keyof typeof MaterialIcons.glyphMap, style?: StyleProp<ViewStyle | ImageStyle> }) {
    const circle = {
        width: size,
        height: size,
        borderRadius: Number(size) / 2,
    }

    const initial = {
        fontSize: Number(size) / 4,
    }
    if (source) {
        return (
            <View style={styles.container}>
                <Image
                    {...rest}
                    style={[styles.avatar, circle, style as StyleProp<ImageStyle>]}
                    source={source}
                />
                {icon && <MaterialIcons name={icon} size={16} style={styles.icon} />}
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View
                {...rest}
                style={[styles.avatar, styles[getColor(name)], circle, style as StyleProp<ViewStyle>]}
            >
                <Text style={[styles.initial, initial]}>{name.at(0)?.toUpperCase()}</Text>
            </View>
            {icon && <MaterialIcons name={icon} size={16} style={styles.icon} />}
        </View>

    );
}

const styles = StyleSheet.create({
    avatar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    icon: {
        display: "flex",
        width: 24,
        height: 24,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        borderColor: "#CCCCCC",
        borderWidth: 1,
        textAlign: "center",
        lineHeight: 22,
        marginTop: -12,
    },
    red: {
        backgroundColor: "#FCC",
    },
    green: {
        backgroundColor: "#CFC",
    },
    blue: {
        backgroundColor: "#CCF",
    },
    initial: {
        fontWeight: "600",
    },
})