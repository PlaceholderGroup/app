import * as Contacts from "expo-contacts";
import * as SQLite from 'expo-sqlite';



//define interfaces for data-types and the values they hold
interface SocialObj{
    social_field: string,
    link: string
}
interface ContactObj{
    contact:Contacts.ExistingContact | undefined,
    is_favorite:boolean | Promise<boolean>,
    social_Objs?:Array<SocialObj> | Promise<Array<SocialObj>>
}

export class DBHelper {

//getters/setters/deleter for contact object meant to be publicly accessible:
//CREATE
async createContactObj(incomingContact: Contacts.Contact, contactCode:string):Promise<Contacts.Contact> {
    
    
    await this.createContact(contactCode)
    if(incomingContact.isFavorite){
        await this.createIsFavorite(contactCode)
    }
    Contacts.addContactAsync(incomingContact)
    const result = incomingContact
        // ContactObj={
        // contact_code: contactCode,
        // is_favorite: isFavorite,
        // social_Objs:socialObjs

    
    if(incomingContact.socialProfiles){
        for(const object of incomingContact.socialProfiles){
            if (object.service && object.url){
            await this.createSocialObj(contactCode, object.service, object.url)
            }
        }
    }
    return result
}

async createSocialObj(contactCode:string, socialField:string, link:string):Promise<SocialObj> {
    await this.createSocialFields(contactCode, socialField, link)
    const result : SocialObj =  {social_field:socialField, link : link}
    return result
}

//GET
async getContactObj(contact_code:string):Promise<ContactObj | string> {
    const result:ContactObj = {
        contact:await Contacts.getContactByIdAsync(contact_code),
        is_favorite: await this.getIsFavorite(contact_code) 
    }
    if(!result){
        return 'No existing contact'
    }
     ContactObj = {
        contact_code: contact_code,
        is_favorite: await this.getIsFavorite(contact_code),
        social_Objs: await this.getSocialFields(contact_code)
    }

    return result
}

// CURRENT PROGRESS ENDS HERE FOR UPDATING TO USING EXPO CONTACTS!!!!

//get single social field
async getSocialObj(contactCode:string, socialField:string){
    const result = await this.getSingleSocialField(contactCode,socialField)
    return result
}
//get all social fields associated with a contact
async getAllSocialObj(contactCode:string):Promise<Array<SocialObj>>{
    const result = await this.getSocialFields(contactCode)
    return result
}

//UPDATE
async updateSocialObj(contactCode:string, oldSocialField:string, newSocialField:string, link:string):Promise<SocialObj>{
    await this.updateSocialField(contactCode,oldSocialField,newSocialField,link)
    const result = this.getSingleSocialField(contactCode,newSocialField)
    return result

}
// async updateContactObj(contact_code:string, is_favorite:boolean, social_fields:Array<SocialObj>):Promise<ContactObj>{
//     for(let i = 0; i < social_fields.length; i++ )
//         await this.updateSocialFields(contact_code, social_fields[i].social_field, social_fields[i].link)
//     if(is_favorite){
//         await this.createIsFavorite(contact_code);
//     }else{
//         await this.deleteIsFavorite(contact_code);
//     }
//     const result = this.getContactObj(contact_code)
//     return result
//}
//DELETE
async deleteContactObj(contact_code:string):Promise<number>{
    const result = this.deleteContact(contact_code)
    return result
}

async deleteSocialObj(contactCode:string, socialField:string):Promise<number>{
    const result = this.deleteSocialField(contactCode,socialField)
    return result
}

//PRIVATE FUNCTIONS
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
            contact_code TEXT UNIQUE NOT NULL,
            FOREIGN KEY (contact_code) REFERENCES contacts(contact_code) ON DELETE CASCADE,
            )`,
            `CREATE TABLE IF NOT EXISTS social_fields(
            contact_code TEXT NOT NULL,
            FOREIGN KEY (contact_code) REFERENCES contacts(id) ON DELETE CASCADE,
            social_field TEXT NOT NULL,
            link TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS personal_fields(
            profile_name TEXT NOT null,
            field_name TEXT NOT NULL,
            field_value TEXT NOT NULL
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

    private async createPersonal(profile:string, fieldName:string, fieldValue:string): Promise<string>{
        const query = `INSERT INTO personal_fields (profile, fieldName, fieldValue) VALUES (?, ?, ?) RETURNING profile_name`;
        try{
            const result = await this.db!.getFirstAsync<{profile:string}>(query, profile, fieldName, fieldValue)
            if(!result){
                throw new Error('Failed to create new personal: No result returned.');
            }
            return result.profile
        }catch(error){
            console.log('Error when creating new personal: ', error);
            throw(error)
        }
    }
    private async updatePersonal(profile:string, fieldName:string, fieldValue:string): Promise<number>{
        const query = `UPDATE personal_fields SET field_value = ? WHERE profile = ? AND field_name = ?`;
        try{
            const result = await this.db!.runAsync(query, [fieldValue, profile, fieldName]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        }catch(error){
            console.log('Error when creating new personal: ', error);
            throw(error)
        }
    }

    private async deletePersonal(profile:string, fieldName:string): Promise<number>{
        const query = `DELETE FROM personal_fields WHERE profile = ? AND field_name = ?`;
        try{
            const result = await this.db!.runAsync(query, [profile, fieldName]);
            return result.changes;
        }catch(error){
            console.log('Error when deleting personal field: ', error);
            throw(error)
        }
    }

    private async readPersonal(profile:string, fieldName:string): Promise<string>{
        const query = `SELECT field_value FROM personal_fields WHERE profile = ? and field_name = ?`;
        try{
            const result = await this.db!.getFirstAsync<string>(query, [profile, fieldName])
            if(!result){
                throw new Error('Failed to retrieve personal field: No result returned.');
            }
            return result
        }catch(error){
            console.log('Error when retrieving personal field: ', error);
            throw(error)
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

    private async getSingleSocialField(contactCode:string, socialField:string): Promise<SocialObj>{
        const query = `SELECT * FROM social_fields WHERE contact_code = ? AND social_field = ?`;
        try{
            const result = await this.db!.getFirstAsync<SocialObj>(query, [contactCode,socialField])
            if(!result){
                throw new Error('Failed to retrieve social field')
            }
            return result
        }
        catch(error){
            throw(error)
        }

    }
    private async getSocialFields(contact_code:string): Promise<Array<SocialObj>>{
        const query = `SELECT * FROM social_fields WHERE contact_code = ?`;
        try{
            const result = await this.db!.getAllAsync<SocialObj>(query, [contact_code]);
            if(!result){
                throw new Error('Failed to retrieve social fields.')
            }
            return result;
        }catch(error){
            console.log('Error when retrieving social fields: ', error);
            throw(error);
        }
        
    }

    private async getIsFavorite(contact_code:string): Promise<boolean>{
        const query = `SELECT * FROM is_favorite WHERE contact_code = ?`;
        try{
            const result = await this.db!.getFirstAsync<string>(query, [contact_code]);
            
            if(!result){
                return false;
            }
            return true;
        }catch(error){
            console.log('Error when retrieving is_favorite: ', error);
            throw(error);
        }
        
    }
    

    //UPDATE:
    
    private async updateSocialField(contact_code:string, oldSocialField:string, social_field:string, link: string): Promise<number>{
        const query = `UPDATE social_fields SET social_field = ?, link = ? WHERE contact_code = ? AND social_field = ?`;
        try{
            const result = await this.db!.runAsync(query, [social_field, link, contact_code, oldSocialField]);
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



}


//export singleton instance of DBHelper (new keyword exports a single instance of DBHelper() no new keyword would export the class):
export default new DBHelper();