import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";

import ContactScreen from "@/screens/ContactScreen";
import { getContact } from "@/utils/contacts";
import * as Contacts from "expo-contacts";
import * as SecureStore from "expo-secure-store";

// TODO: I don't necessarily know that we will want to use `expo-secure-store` here in the long term.
// See https://docs.expo.dev/develop/user-interface/store-data/ for options

export default function Index() {

  const [contact, setContact] = useState<Contacts.ExistingContact>();

  const appState = useRef(AppState.currentState);

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

  // TODO: This won't work if we end up getting our own edit contact functionality, 
  // but for now it's fine
  // TODO: I also don't like that it is duplicated over 3 different files
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (contact) {
          getContact(contact.id, setContact);
        }
      }

      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [contact]);

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
