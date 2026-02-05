import * as SQLite from 'expo-sqlite';


//define interfaces for data-types and the values they hold
interface social_obj{
    social_field: string,
    link: string
}
interface contact_obj{
    contact_code:string,
    is_favorite:boolean,
    social_fields:Array<social_obj>
}

export class DBHelper {
    private db: SQLite.SQLiteDatabase | null;

    constructor(){
        this.db = null;
    }

    private async initDB(): Promise<void> {
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
    

    private async createTables(): Promise<void> {
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
    private async closeDB(): Promise<void> {
        if(this.db){
            this.db.closeAsync();
            this.db = null;
            console.log('DB closed successfully.')
        }
    }

    //CREATE:

    private async createContact (contact_code:string): Promise<string> {
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

    private async createSocialFields (contact_code:string, social_field:string, link:string): Promise<string> {
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

    private async createIsFavorite (contact_code:string): Promise<string> {
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
    private async getAllContacts(): Promise<Array<string>>{
        const query = `SELECT * FROM contacts`;
        try{
            const result = await this.db!.getAllAsync<string>(query);
            return result;
        }catch(error){
            console.log('Error retrieving all contacts: ', error);
            throw(error);
        }
    }

    private async getContact(contact_code:string): Promise<string>{
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

    private async getSocialFields(contact_code:string): Promise<Array<string>>{
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

    private async getIsFavorite(contact_code:string): Promise<string>{
        const query = `SELECT * FROM is_favorite WHERE contact_code = ?`;
        try{
            const result = await this.db!.getFirstAsync<string>(query, [contact_code]);
            if(!result){
                return "False";
            }
            return "True";
        }catch(error){
            console.log('Error when retrieving is_favorite: ', error);
            throw(error);
        }
        
    }
    

    //UPDATE:
    
    private async updateSocialFields(contact_code:string, social_field:string, link: string): Promise<number>{
        const query = `UPDATE social_fields SET social_field = ?, link = ? WHERE contact_code = ?`;
        try{
            const result = await this.db!.runAsync(query, [social_field, link, contact_code]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when updating social field values:', error);
            throw(error);
        }
    }

    //DELETE:
    private async deleteContact(contact_code:string):Promise<number>{
        const query = 'DELETE FROM contacts WHERE contact_code = ?';
        try{
            const result = await this.db!.runAsync(query, [contact_code]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting contact:', error);
            throw(error);
        }
    }
    
    private async deleteSocialField(contact_code:string, social_field:string):Promise<number>{
        const query = 'DELETE FROM social_fields WHERE contact_code = ? AND social_field = ?';
        try{
            const result = await this.db!.runAsync(query, [contact_code, social_field]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting social field:', error);
            throw(error);
        }
    }
    
    private async deleteIsFavorite(contact_code:string):Promise<number>{
        const query = 'DELETE FROM is_favorite WHERE contact_code = ?';
        try{
            const result = await this.db!.runAsync(query, [contact_code]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting is_favorite:', error);
            throw(error);
        }
    }    

//getters/setters/deleter for contact code meant to be publicly accessible:

//GET
async getContactObj(contact_code:string) {
    

}

//UPDATE

//DELETE

}


//export singleton instance of DBHelper (new keyword exports a single instance of DBHelper() no new keyword would export the class):
export default new DBHelper();