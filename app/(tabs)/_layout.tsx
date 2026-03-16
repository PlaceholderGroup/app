import { Lexend_400Regular, Lexend_500Medium, useFonts } from "@expo-google-fonts/lexend";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SplashScreen, Tabs } from "expo-router";

import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import ContactsContext from "../../contexts/ContactsContext";

export default function RootLayout() {

  const [contacts, setContacts] = useState<Array<Contacts.ExistingContact>>([]);

  const [loaded, error] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.FirstName, 
          fields: [Contacts.Fields.Name]
        });
        setContacts(data);

      }
    })();
  }, [])

  return (
    <ContactsContext value={contacts}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Me",
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="person" color={color} />,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="group" color={color} />,
          }}
        />
      </Tabs>
    </ContactsContext>
  );
}
