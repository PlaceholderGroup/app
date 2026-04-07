import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { registerDevMenuItems } from 'expo-dev-client';
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";


export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    registerDevMenuItems([{
      name: "Test page",
      callback: () => {
        router.navigate("/(tabs)/test");
      }
    }])
  }, [])

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
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="science" color={color} />,
          href: null,
        }}
      />
    </Tabs>
  );
}
