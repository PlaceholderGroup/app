import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import ContactsContext from "../../contexts/ContactsContext";

export default function RootLayout() {

  const [contacts, setContacts] = useState<Array<Contacts.Contact>>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          sort: Contacts.SortTypes.FirstName
        });
        setContacts(data);

        // if (data.length > 0) {
        //   const contact = data[0];
        //   console.log(contact.imageAvailable);
        //   console.log(contact.image?.uri);
        //   console.log(contact);
        // }
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
