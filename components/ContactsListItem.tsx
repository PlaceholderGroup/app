import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

export default function ContactsListitem({
    name,
    photo,
    id
}: { name: string, photo?: string, id: string }) {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.navigate({
            pathname: "/contact/[id]",
            params: {
                id
            }
        })}>
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
        paddingVertical: 5,
    },
})