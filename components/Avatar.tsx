import { Image, ImageStyle } from "expo-image";
import { DimensionValue, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const colors = ["red", "green", "blue"] as const;

function getColor(name: string): "red" | "green" | "blue" {
    const index = [...name].reduce((sum, character) => sum += character.charCodeAt(0), 0) % colors.length
    return colors[index];
}

export default function Avatar({ name, size, source, style, ...rest }: { name: string, size: DimensionValue, source?: string, style?: StyleProp<ViewStyle | ImageStyle> }) {
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
            <Image
                {...rest}
                style={[styles.avatar, circle, style as StyleProp<ImageStyle>]}
                source={source}
            />
        );
    }
    return (
        <View
            {...rest}
            style={[styles.avatar, styles[getColor(name)], circle, style as StyleProp<ViewStyle>]}
        >
            <Text style={[styles.initial, initial]}>{name.at(0)?.toUpperCase()}</Text>
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
    container: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
})