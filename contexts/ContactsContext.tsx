import { createContext, useState } from "react";

import * as Contacts from "expo-contacts";

type ContactsContextType = {
    contacts: Contacts.ExistingContact[];
    currentContact?: string;
    setCurrentContact: (id?: string) => void;
};

export const ContactsContext = createContext<ContactsContextType>({
    contacts: [],
    currentContact: undefined,
    setCurrentContact: () => { },
});

type ContactsProviderType = {
    children: React.ReactNode,
    data: Contacts.ExistingContact[]
};

export function ContactsProvider({ children, data }: ContactsProviderType) {
    const [currentId, setCurrentId] = useState<string>();

    return (
        <ContactsContext.Provider value={{
            contacts: data,
            currentContact: currentId,
            setCurrentContact: setCurrentId,
        }}>
            {children}
        </ContactsContext.Provider>
    );
};
