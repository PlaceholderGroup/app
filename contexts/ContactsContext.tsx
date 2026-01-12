import { createContext } from "react";

import * as Contacts from "expo-contacts";

export default createContext<Array<Contacts.Contact>>([]);