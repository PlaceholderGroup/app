import * as SQLite from 'expo-sqlite';


//define interfaces for data-types and the values they hold

class DBHelper {
    private db: SQLite.SQLiteDatabase | null;

    constructor(){
        this.db = null;
    }

    async initDB(): Promise<void> {
        try {this.db = await SQLite.openDatabaseAsync('contactsDB.db');

            await this.db.execAsync('PRAGMA foreign_keys = ON;')
            console.log('DB created successfully.')
            await this.createTables();
        }
        catch(error){
            console.log('Error when creating DB: ', error);
            throw(error);
        }
    }
    

    async createTables(): Promise<void> {
        const queries: string[] = [
            `CREATE TABLE IF NOT EXISTS contacts(
            contact_code TEXT PRIMARY KEY,
            )`,
            `CREATE TABLE IF NOT EXISTS is_favorite(
            contact_code TEXT NOT NULL,
            FOREIGN KEY (contact_code) REFERENCES contacts(contact_code) ON DELETE CASCADE,
            )`,
            `CREATE TABLE IF NOT EXISTS social_fields(
            contact_code TEXT NOT NULL,
            FOREIGN KEY (contact_code) REFERENCES contacts(id) ON DELETE CASCADE,
            social_field TEXT NOT NULL,
            link TEXT NOT NULL
            )`
        ]
        try{
            for(const query of queries){
                await this.db!.execAsync(query);
            }
            console.log('Tables created successfully.');
        }catch(error){
            console.log('Error when creating tables: ', error);
            throw(error);
        }
    }

    //close db for testing
    async closeDB(): Promise<void> {
        if(this.db){
            this.db.closeAsync();
            this.db = null;
            console.log('DB closed successfully.')
        }
    }

    //CREATE:

    async createContact (contact_code:string): Promise<string> {
        const query = `INSERT INTO contacts (contact_code) VALUES (?) RETURNING contact_code`;
        try{
            const result = await this.db!.getFirstAsync<{ contact_code:string }>(query, contact_code);
            if(!result){
                throw new Error('Failed to create contact: No result returned.');
            } 
            return result.contact_code;
        }catch(error){
            console.log('Error when creating new contact: ', error);
            throw(error);
        }

    }

    async createSocialFields (contact_code:string, social_field:string, link:string): Promise<string> {
        const query = `INSERT INTO social_fields (contact_code, social_field, link) VALUES (?,?,?) RETURNING contact_code`;
        try{
            const result = await this.db!.getFirstAsync<{ contact_code:string }>(query, contact_code, social_field, link);
            if(!result){
                throw new Error('Failed to create social_field: No result returned.');
            } 
            return result.contact_code;
        }catch(error){
            console.log('Error when creating new contact: ', error);
            throw(error);
        }

    }

    async createIsFavorite (contact_code:string): Promise<string> {
        const query = `INSERT INTO is_favorite (contact_code) VALUES (?) RETURNING contact_code`;
        try{
            const result = await this.db!.getFirstAsync<{ contact_code:string }>(query, contact_code);
            if(!result){
                throw new Error('Failed to create is_favorite: No result returned.');
            } 
            return result.contact_code;
        }catch(error){
            console.log('Error when creating new contact: ', error);
            throw(error);
        }

    }


    //READ:
    async getAllContacts(): Promise<Array<string>>{
        const query = `SELECT * FROM contacts`;
        try{
            const result = await this.db!.getAllAsync<string>(query);
            return result;
        }catch(error){
            console.log('Error retrieving all contacts: ', error);
            throw(error);
        }
    }

    async getContact(contact_code:number): Promise<string>{
        const query = `SELECT * FROM contacts WHERE contact_code = ?`;
        try{
            const result = await this.db!.getFirstAsync<string>(query, [contact_code]);
            if(!result){
                throw new Error('Failed to retrieve contact.')
            }
            return result;
        }catch(error){
            console.log('Error when retrieving Contact: ', error);
            throw(error);
        }
        
    }

    async getSocialFields(contact_code:number): Promise<Array<string>>{
        const query = `SELECT * FROM social_fields WHERE contact_code = ?`;
        try{
            const result = await this.db!.getAllAsync<string>(query, [contact_code]);
            if(!result){
                throw new Error('Failed to retrieve social fields.')
            }
            return result;
        }catch(error){
            console.log('Error when retrieving social fields: ', error);
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


//export singleton instance of DBHelper:
export default new DBHelper();