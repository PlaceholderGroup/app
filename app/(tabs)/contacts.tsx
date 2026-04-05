import { SectionList, StyleSheet, Text, View } from "react-native";

import ContactsListitem from "@/components/ContactsListItem";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import { ContactsContext } from "@/contexts/ContactsContext";
import * as Contacts from "expo-contacts";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useContext, useMemo, useState } from "react";

export default function ContactsScreen() {

    const navigation = useNavigation();
    const { contacts } = useContext(ContactsContext);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useFocusEffect(
        useCallback(() => {
            const root = navigation.getParent();

            root?.setOptions({
                showSearch: true,
                searchQuery,
                setSearchQuery,
            });

            return () => {
                root?.setOptions({
                    showSearch: false,
                    searchQuery: undefined,
                    setSearchQuery: null,
                });
            }
        }, [navigation, searchQuery])
    );

    const sections = useMemo(() => {
        if (contacts) {
            // TODO: I can probably improve this search
            const filtered = contacts.filter((contact) => contact.name?.toLocaleLowerCase()?.includes(searchQuery.toLowerCase()));

            // Group by first letter
            const groups = filtered.reduce((previous, contact) => {
                const section = contact.name?.at(0)?.toUpperCase() || "";
                const key = /[A-Z]/.test(section) ? section : "#";

                if (!previous[key]) previous[key] = [];
                previous[key].push(contact);
                return previous;
            }, {} as Record<string, Contacts.ExistingContact[]>);

            // Sort the groups
            return Object.keys(groups)
                .sort((a, b) => {
                    if (a === "#") return 1;
                    if (b === "#") return -1;
                    return a.localeCompare(b);
                })
                .map((title) => ({
                    title,
                    data: groups[title].sort(),
                }));
        }
        return [];
    }, [contacts, searchQuery])

    const renderItem = useCallback(({ item, index, section }: { item: Contacts.ExistingContact, index: number, section: any }) => {
        return (
            <View style={[
                styles.contact,
                (index === 0) && styles.firstContact,
                (index === section.data.length - 1) && styles.lastContact,
            ]}>
                <ContactsListitem id={item.id} name={item.name} photo={item.image?.uri} />
            </View>
        )
    }, []);

    const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerLabel}>{title}</Text>
            </View>
        )
    }, []);

    // NOTE: Probably unnecessary, but does probably provide a very slight performance increase
    const keyExtractor = useCallback((item: Contacts.ExistingContact) => item.id, []);

    // TODO: Eventually this should use a SectionList and group by letter.
    // https://reactnative.dev/docs/sectionlist
    return (
        <TabsSafeAreaView>
            {contacts !== undefined &&
                <SectionList
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={keyExtractor}
                    removeClippedSubviews={true}
                    windowSize={16}
                    contentContainerStyle={styles.list}
                />
            }
        </TabsSafeAreaView>
    )
}

const styles = StyleSheet.create({
    list: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        paddingTop: 0,
        alignSelf: "stretch",
    },
    header: {
        marginVertical: 20,
    },
    headerLabel: {
        fontFamily: "Lexend_400Regular",
        fontWeight: 400,
    },
    contact: {
        display: "flex",
        backgroundColor: "#FFFFFF",
        borderColor: "#CCCCCC",
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    firstContact: {
        borderTopWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
    },
    lastContact: {
        borderBottomWidth: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 10,
    },
})