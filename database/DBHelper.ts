import * as SQLite from 'expo-sqlite';


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

interface iOS_unique{
    id: number;
    contact_code: number;
    social_field: string;
    link: string;
}






class DBHelper {
    private db: SQLite.SQLiteDatabase | null;

    constructor(){
        this.db = null;
    }

    async initDB(): Promise<void> {
        try {this.db = await SQLite.openDatabaseAsync('contactsDB.db');

            await this.db.execAsync('PRAGMA foreign_keys = ON;')
            console.log('DB created successfully.')
        }
        catch(error){
            console.log('Error wwwhen creating DB: ', error);
            throw(error);
        }
    }
    

    async createTables(): Promise<void> {
        const queries: string[] = [
            `CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            profile_picture TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            )`,
            `CREATE TABLE IF NOT EXISTS contacts(
            contact_code INTEGER PRIMARY KEY AUTOINCREMENT,
            personal INTEGER DEFAULT 0,
            firstName TEXT NOT NULL,
            lastName TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS unique_fields(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            FOREIGN KEY (contact_code) REFERENCES contacts(id) ON DELETE CASCADE,
            field_type TEXT NOT NULL,
            field_value TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS iOS_unique(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            FOREIGN KEY (contact_code) REFEENCES contacts(id) ON DELETE CASCADE,
            social_field TEXT NOT NULL,
            link TEXT NOT NULL
            )`
        ]
        try{
            for(const query in queries){
                await this.db!.execAsync(query);
            }
            console.log('Tables created successfully.');
        }catch(error){
            console.log('Error when creating tables: ', error);
            throw(error);
        }
    }

    //CREATE:
    async createNewUser(username:string): Promise<number> {
        const query = `INSERT INTO users (username) VALUES (?)`;
        try{
            const result = await this.db!.runAsync(query, [username]);
            return result.lastInsertRowId;
        }catch(error){
            console.log('Error creating new user: ', error);
            throw(error);
        }
    } 

    async createNewContact (personal:number, firstName:string, lastName?:string): Promise<number> {
        const query = `INSERT INTO contacts (personal, firstName, lastName) VALUES (?,?,?)`;
        try{
            const result = await this.db!.runAsync(query, [personal, firstName, lastName ?? null]);
            return result.lastInsertRowId;
        }catch(error){
            console.log('Error when creating new contact: ', error);
            throw(error);
        }

    }

    async createNewUniqueFields(contact_code:number, field_type:string, field_value:string): Promise<number> {
        const query = `INSERT INTO unique_fields (contact_code, field_type, field_value) VALUES (?,?,?)`;
        try{
            const result = await this.db!.runAsync(query, [contact_code, field_type, field_value]);
            return result.lastInsertRowId;
        }catch(error){
            console.log('Error when creating new unique field: ', error);
            throw(error);
        }
    }

    async createNewiOSUnique(contact_code:number, social_field:string, link:string): Promise<number> {
        const query = `INSERT INTO unique_fields (contact_code, social_field, link) VALUES (?,?,?)`;
        try{
            const result = await this.db!.runAsync(query, [contact_code, social_field, link]);
            return result.lastInsertRowId;
        }catch(error){
            console.log('Error when creating new iOS social field: ', error);
            throw(error);
        }
}


    //READ:
    async getUser(IdValue:number): Promise<User | null>{
        const query = `SELECT * FROM users WHERE id = ?`;
        try{
            const result = await this.db!.getFirstAsync<User>(query, [IdValue]);
            return result || null;
        }catch(error){
            console.log('Error when retrieving User: ', error);
            throw(error);
        }
        
    }


    async getContact(IdValue:number): Promise<Contact | null>{
        const query = `SELECT * FROM contacts WHERE id = ?`;
        try{
            const result = await this.db!.getFirstAsync<Contact>(query, [IdValue]);
            return result || null;
        }catch(error){
            console.log('Error when retrieving Contact: ', error);
            throw(error);
        }
        
    }

    async uniqueFields(IdValue:number): Promise<unique_field | null>{
        const query = `SELECT * FROM unique_fields WHERE id = ?`;
        try{
            const result = await this.db!.getFirstAsync<unique_field>(query, [IdValue]);
            return result || null;
        }catch(error){
            console.log('Error when retrieving field: ', error);
            throw(error);
        }
        
    }

    async getIosUnique(IdValue:number): Promise<iOS_unique | null>{
        const query = `SELECT * FROM iOS_unique WHERE id = ?`;
        try{
            const result = await this.db!.getFirstAsync<iOS_unique>(query, [IdValue]);
            return result || null;
        }catch(error){
            console.log('Error when retrieving iOS field: ', error);
            throw(error);
        }
        
    }
    

    //UPDATE:

    async updateUser(IdValue:number, username:string|null, profile_picture: string|null, setting_placeholder:string|null): Promise<number>{
        const query = `UPDATE users SET username = ?, profile_picture = ?, setting_placeholder = ? WHERE id = ?`;
        try{
            const result = await this.db!.runAsync(query, [username, profile_picture, setting_placeholder, IdValue]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when updating user values:', error);
            throw(error);
        }
    }

    async updateContact(contact_code:number, firstName:string|null, lastName: string|null,): Promise<number>{
        const query = `UPDATE contacts SET firstName = ?, lastName = ? WHERE contact_code = ?`;
        try{
            const result = await this.db!.runAsync(query, [firstName, lastName, contact_code]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when updating contact values:', error);
            throw(error);
        }
    }
    
    async updateUniqueFields(IdValue:number, field_type:string|null, field_value: string|null): Promise<number>{
        const query = `UPDATE unique_fields SET field_type = ?, field_value = ? WHERE id = ?`;
        try{
            const result = await this.db!.runAsync(query, [field_type, field_value, IdValue]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when updating unique field values:', error);
            throw(error);
        }
    }
    
    async updateiOSUnique(IdValue:number, social_field:string|null, link: string|null): Promise<number>{
        const query = `UPDATE iOS_unique SET social_field = ?, link = ? WHERE id = ?`;
        try{
            const result = await this.db!.runAsync(query, [social_field, link, IdValue]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when updating iOS field values:', error);
            throw(error);
        }
    } 



    //DELETE:

    async deleteUser(IdValue:number):Promise<number>{
        const query = 'DELETE FROM users WHERE id = ?';
        try{
            const result = await this.db!.runAsync(query, [IdValue]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting user:', error);
            throw(error);
        }
    }

    async deleteContact(IdValue:number):Promise<number>{
        const query = 'DELETE FROM contacts WHERE contact_code = ?';
        try{
            const result = await this.db!.runAsync(query, [IdValue]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting contact:', error);
            throw(error);
        }
    }
    
    async deleteUniqueField(IdValue:number):Promise<number>{
        const query = 'DELETE FROM unique_fields WHERE id = ?';
        try{
            const result = await this.db!.runAsync(query, [IdValue]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting unique field:', error);
            throw(error);
        }
    }
    
    async deleteiOSUnique(IdValue:number):Promise<number>{
        const query = 'DELETE FROM iOS_unique WHERE id = ?';
        try{
            const result = await this.db!.runAsync(query, [IdValue]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting unique iOS field:', error);
            throw(error);
        }
    }    



}