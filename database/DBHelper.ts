import * as SQLite from 'expo-sqlite';
import { Text } from 'react-native';


//define interfaces for data-types and the values they hold

interface User{
    id: number;
    username: string;
    profile_picture: string;
    setting_placeholder: string;
}

interface Contact{
    contact_code: number;
    personal: boolean;
    firstName: string;
    lastName: string;
}

interface unique_field{
    id: number;
    contact_code: number;
    field_type: string;
    field_value: string;
}






class DBHelper {
    private db: SQLite.SQLiteDatabase | null;

    constructor(){
        this.db = null;
    }

    async initDB(): Promise<void> {
        try {this.db = await SQLite.openDatabaseAsync('contactsDB.db');

            await this.db.execAsync('PRAGMA foreign_keys = ON;')
        }
    }
    

}