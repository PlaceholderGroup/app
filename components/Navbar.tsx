import AddProfile from "@/components/AddProfile";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { ContactsContext } from "@/contexts/ContactsContext";
import { ProfilesContext } from "@/contexts/ProfilesContext";
import DBHelper from "@/database/DBHelper";
import { deduplicate, editContact } from "@/utils/contacts";
import { retryUntilTrue } from "@/utils/hacks";
import { useContext, useState } from "react";
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
    const { setProfiles } = useContext(ProfilesContext);
    const [showAddProfile, setShowAddProfile] = useState(false);

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
                <>
                    <Button icon="add" type="tertiary" onPress={() => setShowAddProfile(true)} />
                    <AddProfile
                        visible={showAddProfile}
                        onClose={async () => {
                            setShowAddProfile(false);
                            await retryUntilTrue(() => DBHelper.getDBStatus());
                            const profiles = await DBHelper.getAllProfileObjs(currentContact);
                            profiles.forEach(profile => {
                                if (profile.contact !== undefined) {
                                    profile.contact = deduplicate(profile.contact);
                                    if (profile.contact.image === undefined) {
                                        profile.contact.image = { uri: profile.picture_link }
                                    }
                                    else {
                                        profile.contact.image.uri = profile.picture_link;
                                    }
                                }
                            });
                            setProfiles(profiles);
                        }}
                        currentContact={currentContact} />
                </>
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