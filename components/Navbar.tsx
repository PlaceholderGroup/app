import Button from "@/components/Button";
import { ContactsContext } from "@/contexts/ContactsContext";
import { editContact } from "@/utils/contacts";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavbarProps = {
    canGoBack: boolean,
    onBack?: () => void,
}

export default function Navbar({ canGoBack, onBack }: NavbarProps) {
    const { currentContact } = useContext(ContactsContext);

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
            {canGoBack && <Button icon="arrow-back-ios-new" type="tertiary" onPress={onBack} />}
            <View style={styles.spacer} />
            {currentContact !== undefined && (
                <Button icon="edit" type="tertiary" onPress={() => {
                    editContact(currentContact);
                }} />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.50)",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        paddingHorizontal: 10,
        paddingBottom: 4,
        gap: 20,
    },
    spacer: {
        alignSelf: "stretch",
        flex: 1,
    },
})