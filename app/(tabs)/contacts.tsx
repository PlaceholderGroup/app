import { FlatList } from "react-native";

import { useContext } from "react";
import ContactsListitem from "../../components/ContactsListItem";
import TabsSafeAreaView from "../../components/TabsSafeAreaView";
import ContactsContext from "../../contexts/ContactsContext";

export default function ContactsScreen() {

    const contacts = useContext(ContactsContext);

    // TODO: Eventually this should use a SectionList and group by letter.
    // https://reactnative.dev/docs/sectionlist
    return (
        <TabsSafeAreaView>
            {contacts !== undefined &&
                <FlatList
                    data={contacts}
                    renderItem={({ item }) => {
                    return <ContactsListitem id={item.id} name={item.name} photo={item.image?.uri} />
                }}
                />
            }
        </TabsSafeAreaView>
    )
}