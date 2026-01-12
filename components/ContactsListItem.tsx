import { Pressable, StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

export default function ContactsListitem({
    name,
    photo
}: { name: string, photo?: string }) {
    return (
        <Pressable onPress={() => console.log(name)}>
            <View style={styles.container}>
                <Avatar source={photo} size={48} name={name} />
                <Text>{name}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
})