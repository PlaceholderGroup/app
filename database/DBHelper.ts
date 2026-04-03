import * as Contacts from "expo-contacts";
import * as SQLite from 'expo-sqlite';
import { Platform } from "react-native";
 
export interface SocialObj {
    social_field: string,
    link: string,
    service: string
}
 
export interface profileObj {
    profile_id: number,
    name: string,
    icon: string ,
    picture_link: string,
    fields: fields[],
    contact: Contacts.ExistingContact
}

export interface fields{
    field_name: string
    field_id: string
}
 
export class DBHelper {
 
    // -------------------------------------------------------------------------
    // PUBLIC API
    // -------------------------------------------------------------------------
 
    async getContactObj(id: string): Promise<Contacts.ExistingContact | undefined> {
        const contact = await Contacts.getContactByIdAsync(id);
 
        if (contact) {
            if (Platform.OS !== "ios") {
                const socialProfiles = await this.getAllSocialObj(id);
                if (socialProfiles) {
                    contact.socialProfiles = socialProfiles.map((i): Contacts.SocialProfile => ({
                        label: i.social_field,
                        service: i.service,
                        url: i.link
                    }));
                }
            }
            if (Platform.OS !== "android") {
                const isFavorite = await this.getIsFavorite(id);
                if (isFavorite) {
                    contact.isFavorite = isFavorite;
                }
            }
        }
 
        return contact;
    }
 
    async createContactObj(incomingContact: Contacts.Contact): Promise<Contacts.Contact> {
        const result = incomingContact;
        const contactCode = await Contacts.addContactAsync(incomingContact);
 
        await this.createContact(contactCode);
 
        if (incomingContact.isFavorite) {
            await this.createIsFavorite(contactCode);
        }
 
        if (incomingContact.socialProfiles) {
            for (const object of incomingContact.socialProfiles) {
                if (object.service && object.url) {
                    await this.createSocialFields(contactCode, object.label, object.service, object.url);
                }
            }
        }
 
        return result;
    }

    // Just run expo update contact function.
    async updateContactObj(incomingContact: Contacts.ExistingContact): Promise<string>{
        return Contacts.updateContactAsync(incomingContact)

    }

    async deleteContactObj(contactCode: string): Promise<number> {
        return this.deleteContact(contactCode);
    }

    // Need to know how we need to retrieve the contact. Should we need you to get the profile object to return one?
    async createProfileObj(contactCode: string, name: string, icon: string, picture_link : string, fields: fields[]): Promise<profileObj>{
        const result = await this.createProfile(contactCode, name, icon, picture_link)
        for(const field of fields){
            await this.createFields(result.profile_id, field.field_name, field.field_id)
        }
        return result

    }
    // Make sure to set the contact using the contactCode in the contact field in the obj
    async getProfileObj(contactCode: string, profileId: number){
        const profile = await this.getProfile(contactCode, profileId)
        
        const fields = await this.readAllFields(profile.profile_id)
        
        
        // Grab contact this profile refers to.
        const returnedContact = await Contacts.getContactByIdAsync(contactCode);
        if (!returnedContact) throw new Error('Contact not found.');
        if (profile.name == "Stock"){
            profile.contact = returnedContact
            return profile
        }else{
            const updatedContact = { ...returnedContact}
            // Need to use the field.field_name to get the contact.field then get the specific one by field_id
            for(const field of fields){
                const fieldName = field.field_name as keyof typeof returnedContact
                const fieldArray = returnedContact[fieldName] as any[]
                const specificValue = fieldArray?.find(item => item.id === field.field_id);
                (updatedContact as any)[fieldName] = specificValue ? [specificValue]:[];

            }
            profile.contact = updatedContact
            return profile
        }

    }

    async getAllProfileObjs(contact_code:string){
        let profileObjects:profileObj[] = []
        const profileIDs = await this.getAllProfileIDs(contact_code)
        for(const id of profileIDs){
            profileObjects.push(await this.getProfileObj(contact_code, id))
        }
        return profileObjects
        
    }

    async updateProfileObj(profile_id:number, name: string, icon: string, picture_link: string, fields:fields[]){
        const result = await this.updateProfile(profile_id, name, icon, picture_link)
        for(const field of fields){
            await this.updateField(profile_id, field.field_name, field.field_id)
        }
        return result
    }

    async deleteProfileObj(profile_id: number){
        const result = await this.deleteProfile(profile_id)
        return result

    }
 
    async createSocialObj(contactCode: string, label: string, service: string, link: string): Promise<Contacts.SocialProfile> {
        await this.createSocialFields(contactCode, label, service, link);
        const result: Contacts.SocialProfile = { label: label, url: link };
        return result;
    }
 
    async getSocialObj(contactCode: string, socialField: string) {
        return await this.getSingleSocialField(contactCode, socialField);
    }
 
    async getAllSocialObj(contactCode: string): Promise<Array<SocialObj>> {
        return await this.getSocialFields(contactCode);
    }
 
    async updateSocialObj(contactCode: string, oldSocialField: string, newSocialField: string, link: string): Promise<SocialObj> {
        await this.updateSocialField(contactCode, oldSocialField, newSocialField, link);
        return this.getSingleSocialField(contactCode, newSocialField);
    }
 

 
    async deleteSocialObj(contactCode: string, socialField: string): Promise<number> {
        return this.deleteSocialField(contactCode, socialField);
    }
 
    // -------------------------------------------------------------------------
    // PRIVATE: DB Setup
    // -------------------------------------------------------------------------
 
    private db: SQLite.SQLiteDatabase | null;
 
    constructor() {
        this.db = null;
    }
 
    async initDB(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync('contactsDB.db');
            await this.db.execAsync('PRAGMA foreign_keys = ON;');
            console.log('DB created successfully.');
            await this.createTables();
        } catch (error) {
            console.log('Error when creating DB: ', error);
            throw error;
        }
    }
 
    private async createTables(): Promise<void> {
        const queries: string[] = [
            `CREATE TABLE IF NOT EXISTS contacts(
                contact_code TEXT PRIMARY KEY
            )`,
            `CREATE TABLE IF NOT EXISTS is_favorite(
                contact_code TEXT UNIQUE NOT NULL,
                FOREIGN KEY (contact_code) REFERENCES contacts(contact_code) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS social_fields(
                contact_code TEXT NOT NULL,
                label TEXT NOT NULL,
                service TEXT NOT NULL,
                link TEXT NOT NULL,
                FOREIGN KEY (contact_code) REFERENCES contacts(contact_code) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS profiles(
                profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
                contact_code TEXT NOT NULL,
                name TEXT NOT NULL,
                icon TEXT,
                picture_link TEXT,
                FOREIGN KEY (contact_code) REFERENCES contacts(contact_code) ON DELETE CASCADE
            )`,

            `CREATE TABLE IF NOT EXISTS fields(
                profile_id INTEGER NOT NULL,
                field_name TEXT NOT NULL,
                field_id TEXT NOT NULL,
                FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
            )`
        ];
        try {
            for (const query of queries) {
                await this.db!.execAsync(query);
            }
            console.log('Tables created successfully.');
        } catch (error) {
            console.log('Error when creating tables: ', error);
            throw error;
        }
    }
 
    private async closeDB(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
            console.log('DB closed successfully.');
        }
    }
    // -------------------------------------------------------------------------
    // PRIVATE: fields table
    // -------------------------------------------------------------------------
    private async createFields(profile_id: number, field_name: string, field_id: string): Promise<number>{
        const query = `INSERT INTO fields (profile_id, field_name, field_id) VALUES (?, ?, ?) RETURNING field_id`;
        try{
            const result = await this.db!.getFirstAsync<{profile_id: number}>(query, [profile_id,field_name,field_id])
            if (!result) throw new Error('Failed to create profile: No result returned.');
            return result.profile_id;
        } catch (error) {
            console.log('Error when creating field: ', error);
            throw error;
    }}

    private async readAllFields(profile_id: number): Promise<fields[]>{
        const query = `SELECT * FROM fields WHERE profile_id = ?`;
        try{
            const returnedFields:fields[] = await this.db!.getAllAsync<fields>(query, [profile_id])
            if (!returnedFields) throw new Error('Failed to read fields: No result returned.');
            return returnedFields;
            } catch (error) {
            console.log('Error when reading field:s ', error);
            throw error;
    }}

    private async updateField(profile_id: number,field_name: string, field_id: string){
        const query = `UPDATE fields SET field_name = ?, field_id = ? WHERE profile_id = ?`;
        try{
            const result = await this.db!.runAsync(query, [field_name, field_id, profile_id])
            return result.changes;
        }catch(error){
            console.log('Error when updating field: ', error);
            throw error;
        }
    }

    private async deleteField(profile_id: number, field_name: string, field_id: string): Promise<number>{
        const query = `DELETE FROM fields WHERE profile_id = ? AND field_name = ? AND field_id = ?`;
        try{
            const result = await this.db!.runAsync(query, [profile_id, field_name, field_id])
        return result.changes;
        } catch (error) {
            console.log('Error when deleting field: ', error);
            throw error;
        }
    }

    // -------------------------------------------------------------------------
    // PRIVATE: profiles table
    // -------------------------------------------------------------------------
 
    private async createProfile(contact_code: string, name: string, icon: string, picture_link : string): Promise<profileObj> {
        const query = `INSERT INTO profiles (contact_code, name, icon, picture_link) VALUES (?, ?, ?, ?) RETURNING name`;
        try {
            const result = await this.db!.getFirstAsync<{profile_id: number}>(query, [contact_code, name, icon, picture_link]);
            if (!result) throw new Error('Failed to create profile: No result returned.');
            return this.getProfile(contact_code, result.profile_id);
        } catch (error) {
            console.log('Error when creating profile: ', error);
            throw error;
        }
    }

    // Need to follow this template for ALL of the reads and ^ for all of the creates
    private async getAllProfileIDs(contact_code: string): Promise<number[]> {
        const query = `SELECT profile_id FROM profiles WHERE contact_code = ?`;
        try {
            const result = await this.db!.getAllAsync<number>(query, [contact_code]);
            return result
        }catch (error) {
            console.log('Error when retrieving profile: ', error);
            throw error;
        }
    }
 
    private async getProfile(contact_code: string, profile_id: number): Promise<profileObj> {
        const query = `SELECT * FROM profiles WHERE contact_code = ? AND profile_id = ?`;
        try {
            const result = await this.db!.getFirstAsync<{
                profile_id: number
                name: string
                icon: string
                picture_link: string
                contact_code: string
            }>(query, [contact_code, profile_id]);
            // check for missing info and need to check if contact exists
            if (!result) throw new Error('Failed to retrieve profile.');
            const contact = await Contacts.getContactByIdAsync(result.contact_code);
            if (!contact) throw new Error('Failed to retrieve contact for profile.');
            const fields = await this.readAllFields(result.profile_id)

            return {
                profile_id: result.profile_id,
                name: result.name,
                icon: result.icon,
                picture_link: result.picture_link,
                fields: fields,
                contact: contact
            };
        } catch (error) {
            console.log('Error when retrieving profile: ', error);
            throw error;
        }
    }
 
    private async updateProfile(profile_id: number, name: string, icon: string, picture_link : string): Promise<number> {
        const query = `UPDATE profiles SET name = ?, icon = ?, picture_link = ? WHERE profile_id = ?`;
        try {
            const result = await this.db!.runAsync(query, [name, icon, picture_link, profile_id]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        } catch (error) {
            console.log('Error when updating profile: ', error);
            throw error;
        }
    }
 
    private async deleteProfile(profile_id: number): Promise<number> {
        const query = `DELETE FROM profiles WHERE profile_id = ?`;
        try {
            const result = await this.db!.runAsync(query, [profile_id]);
            return result.changes;
        } catch (error) {
            console.log('Error when deleting profile: ', error);
            throw error;
        }
    }
 
    // -------------------------------------------------------------------------
    // PRIVATE: contacts table
    // -------------------------------------------------------------------------
 
    private async createContact(contact_code: string): Promise<string> {
        const query = `INSERT INTO contacts (contact_code) VALUES (?) RETURNING contact_code`;
        try {
            const result = await this.db!.getFirstAsync<{contact_code: string}>(query, [contact_code]);
            if (!result) throw new Error('Failed to create contact: No result returned.');
            return result.contact_code;
        } catch (error) {
            console.log('Error when creating new contact: ', error);
            throw error;
        }
    }
 
    private async getContact(contact_code: string): Promise<string> {
        const query = `SELECT * FROM contacts WHERE contact_code = ?`;
        try {
            const result = await this.db!.getFirstAsync<string>(query, [contact_code]);
            if (!result) throw new Error('Failed to retrieve contact.');
            return result;
        } catch (error) {
            console.log('Error when retrieving contact: ', error);
            throw error;
        }
    }
 
    private async getAllContacts(): Promise<Array<string>> {
        const query = `SELECT * FROM contacts`;
        try {
            return await this.db!.getAllAsync<string>(query);
        } catch (error) {
            console.log('Error retrieving all contacts: ', error);
            throw error;
        }
    }
 
    private async deleteContact(contact_code: string): Promise<number> {
        const query = `DELETE FROM contacts WHERE contact_code = ?`;
        try {
            const result = await this.db!.runAsync(query, [contact_code]);
            return result.changes;
        } catch (error) {
            console.log('Error when deleting contact: ', error);
            throw error;
        }
    }
 
    // -------------------------------------------------------------------------
    // PRIVATE: is_favorite table
    // -------------------------------------------------------------------------
 
    private async createIsFavorite(contact_code: string): Promise<string> {
        const query = `INSERT INTO is_favorite (contact_code) VALUES (?) RETURNING contact_code`;
        try {
            const result = await this.db!.getFirstAsync<{ contact_code: string }>(query, [contact_code]);
            if (!result) throw new Error('Failed to create is_favorite: No result returned.');
            return result.contact_code;
        } catch (error) {
            console.log('Error when creating is_favorite: ', error);
            throw error;
        }
    }
 
    private async getIsFavorite(contact_code: string): Promise<boolean> {
        const query = `SELECT * FROM is_favorite WHERE contact_code = ?`;
        try {
            const result = await this.db!.getFirstAsync<string>(query, [contact_code]);
            return !!result;
        } catch (error) {
            console.log('Error when retrieving is_favorite: ', error);
            throw error;
        }
    }
 
    private async deleteIsFavorite(contact_code: string): Promise<number> {
        const query = `DELETE FROM is_favorite WHERE contact_code = ?`;
        try {
            const result = await this.db!.runAsync(query, [contact_code]);
            return result.changes;
        } catch (error) {
            console.log('Error when deleting is_favorite: ', error);
            throw error;
        }
    }
 
    // -------------------------------------------------------------------------
    // PRIVATE: social_fields table
    // -------------------------------------------------------------------------
 
    private async createSocialFields(contact_code: string, label: string, service: string, link: string): Promise<SocialObj> {
        const query = `INSERT INTO social_fields (contact_code, label, service, link) VALUES (?,?,?,?) RETURNING contact_code`;
        try {
            const result = await this.db!.getFirstAsync<SocialObj>(query, [contact_code, label, service, link]);
            if (!result) throw new Error('Failed to create social_field: No result returned.');
            return result;
        } catch (error) {
            console.log('Error when creating social field: ', error);
            throw error;
        }
    }
 
    private async getSingleSocialField(contactCode: string, socialField: string): Promise<SocialObj> {
        const query = `SELECT * FROM social_fields WHERE contact_code = ? AND label = ?`;
        try {
            const result = await this.db!.getFirstAsync<SocialObj>(query, [contactCode, socialField]);
            if (!result) throw new Error('Failed to retrieve social field.');
            return result;
        } catch (error) {
            throw error;
        }
    }
 
    private async getSocialFields(contact_code: string): Promise<Array<SocialObj>> {
        const query = `SELECT * FROM social_fields WHERE contact_code = ?`;
        try {
            const result = await this.db!.getAllAsync<SocialObj>(query, [contact_code]);
            if (!result) throw new Error('Failed to retrieve social fields.');
            return result;
        } catch (error) {
            console.log('Error when retrieving social fields: ', error);
            throw error;
        }
    }
 
    private async updateSocialField(contact_code: string, oldLabel: string, newLabel: string, link: string): Promise<number> {
        const query = `UPDATE social_fields SET label = ?, link = ? WHERE contact_code = ? AND label = ?`;
        try {
            const result = await this.db!.runAsync(query, [newLabel, link, contact_code, oldLabel]);
            console.log('Rows affected:', result.changes);
            return result.changes;
        } catch (error) {
            console.log('Error when updating social field: ', error);
            throw error;
        }
    }
 
    private async deleteSocialField(contact_code: string, label: string): Promise<number> {
        const query = `DELETE FROM social_fields WHERE contact_code = ? AND label = ?`;
        try {
            const result = await this.db!.runAsync(query, [contact_code, label]);
            return result.changes;
        } catch (error) {
            console.log('Error when deleting social field: ', error);
            throw error;
        }
    }
 

}
 
export default new DBHelper();