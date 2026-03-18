

import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ContactScreen from "@/screens/ContactScreen";
import { getContact } from "@/utils/contacts";
import * as Contacts from "expo-contacts";
import * as SecureStore from "expo-secure-store";

// TODO: I don't necessarily know that we will want to use `expo-secure-store` here in the long term.
// See https://docs.expo.dev/develop/user-interface/store-data/ for options

export default function Index() {

  const [contact, setContact] = useState<Contacts.ExistingContact>();

  useEffect(() => {
    (async () => {
      let userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        getContact(userId, setContact);
      } else {
        Contacts.presentContactPickerAsync()
          .then((data) => {
            if (data) {
              SecureStore.setItemAsync("userId", data.id);
              // NOTE: We don't use the returned contact info directly because (at least in my testing
              // so far on Android) it returns a lower quality contact photo
              getContact(data.id, setContact);
            }
          });
      }
    })();
  }, []);

  return (
    <View style={styles.body}>
      {(contact) && <ContactScreen contact={contact} />}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
