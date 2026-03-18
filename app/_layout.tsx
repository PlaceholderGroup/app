import Navbar from "@/components/Navbar";
import ContactsContext from "@/contexts/ContactsContext";
import { Lexend_400Regular, Lexend_500Medium, useFonts } from "@expo-google-fonts/lexend";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Contacts from "expo-contacts";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#F1EEE6",
    },
};

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
            <StatusBar style="dark" />
            <ThemeProvider value={Theme}>
                <Stack screenOptions={{
                    headerShown: true,
                    header: ({ options, route, navigation }) => {
                        return <Navbar onBack={navigation.goBack} canGoBack={navigation.canGoBack()} />
                    },
                    headerTransparent: true,
                }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="contact/[id]" />
                </Stack>
            </ThemeProvider>
        </ContactsContext >
    )
}