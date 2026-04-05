import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

const ContactsListItem = memo(({
    name,
    photo,
    id
}: { name: string, photo?: string, id: string }) => {
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
                <Text style={styles.text}>{name}</Text>
            </View>
        </Pressable>
    );
});

export default ContactsListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 5,
        flex: 1,
    },
    text: {
        wordWrap: "break-word",
        flex: 1,
    },
})