import Navbar from "@/components/Navbar";
import { ContactsProvider } from "@/contexts/ContactsContext";
import { getContacts } from "@/utils/contacts";
import { Lexend_400Regular, Lexend_500Medium, useFonts } from "@expo-google-fonts/lexend";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Contacts from "expo-contacts";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#F1EEE6",
    },
};

export default function RootLayout() {

    const [contacts, setContacts] = useState<Array<Contacts.ExistingContact>>([]);

    const appState = useRef(AppState.currentState);

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
        getContacts(setContacts);
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
                getContacts(setContacts);
            }

            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <ContactsProvider data={contacts}>
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
        </ContactsProvider>
    )
}