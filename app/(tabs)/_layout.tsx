import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";


export default function RootLayout() {

  return (
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
  );
}
