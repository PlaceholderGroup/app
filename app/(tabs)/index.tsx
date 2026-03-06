import TabsSafeAreaView from "@/components/TabsSafeAreaView";


import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ContactScreen from "@/screens/ContactScreen";
import * as Contacts from "expo-contacts";
import * as SecureStore from "expo-secure-store";

// TODO: I don't necessarily know that we will want to use `expo-secure-store` here in the long term.
// See https://docs.expo.dev/develop/user-interface/store-data/ for options

export default function Index() {

  const [contact, setContact] = useState<Contacts.ExistingContact>();

  function getContact(userId: string) {
    Contacts.getContactByIdAsync(userId, [Contacts.Fields.RawImage, Contacts.Fields.PhoneNumbers])
      .then((data) => {
        if (data) {
          setContact(data);
        }
      });
  }

  useEffect(() => {
    (async () => {
      let userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        getContact(userId);
      } else {
        Contacts.presentContactPickerAsync()
          .then((data) => {
            if (data) {
              SecureStore.setItemAsync("userId", data.id);
              // NOTE: We don't use the returned contact info directly because (at least in my testing
              // so far on Android) it returns a lower quality contact photo
              getContact(data.id);
            }
          });
      }
    })();
  }, []);

  return (
    <TabsSafeAreaView>
      <View style={styles.body}>
        {(contact) && <ContactScreen contact={contact} />}
      </View>
    </TabsSafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
