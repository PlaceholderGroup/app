import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { ContactsContext } from "@/contexts/ContactsContext";
import { editContact } from "@/utils/contacts";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavbarProps = {
    canGoBack: boolean,
    onBack?: () => void,
    showSearch?: boolean,
    searchQuery?: string,
    setSearchQuery?: (text: string) => void,
}

export default function Navbar({ canGoBack, onBack, showSearch, searchQuery, setSearchQuery }: NavbarProps) {
    const { currentContact } = useContext(ContactsContext);

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={[
            styles.container,
            showSearch && styles.searchContainer
        ]}>
            {canGoBack && <Button icon="arrow-back-ios-new" type="tertiary" onPress={onBack} />}
            {showSearch ? (
                <SearchBar
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            ) : (
                <View style={styles.spacer} />
            )}
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
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    spacer: {
        alignSelf: "stretch",
        flex: 1,
    },
})