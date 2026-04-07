
import Button from "@/components/Button";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import DBHelper from "@/database/DBHelper";
import { getContact } from "@/utils/contacts";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View } from "react-native";


export default function TestScreen() {

    async function createProfile() {
        const id = await SecureStore.getItemAsync("userId");
        if (id !== null) {
            const contact = await getContact(id);
            if (contact) {
                const phoneNumber = contact.phoneNumbers?.at(0);
                if (phoneNumber) {
                    await DBHelper.createProfileObj(contact.id, "Work", "work", contact.image?.uri || "", [{ field_name: "phoneNumbers", field_id: phoneNumber.id || "" }]);
                }
            }
        }
    }

    async function deleteProfiles() {
        const id = await SecureStore.getItemAsync("userId");
        if (id !== null) {
            const profiles = await DBHelper.getAllProfileObjs(id);
            for (const profile of profiles) {
                if (profile.name !== "Stock") {
                    await DBHelper.deleteProfileObj(profile.profile_id);
                }
            }
        }
    }

    return (
        <TabsSafeAreaView>
            <View style={styles.body}>
                <Button title="Create profile" icon="add" onPress={createProfile} />
                <Button title="Delete profiles" icon="delete" onPress={deleteProfiles} />
            </View>
        </TabsSafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        gap: 10,
        padding: 10,
    },
});
