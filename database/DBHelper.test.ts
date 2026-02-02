
import DBHelper from './DBHelper';

describe('DBHelper Tests', () => {
    //init db once for all tests
    beforeAll(async () => {
        await DBHelper.initDB();
    });

    afterAll(async () => {
        await DBHelper.closeDB();
    })
    
    test('Should init the db', async () => {
        await DBHelper.initDB();
        expect(DBHelper).toBeDefined();
    });

    test('should create user', async () => {
        const result = await DBHelper.createUser('tester2');
        expect(result).toBeGreaterThan(0);
    });

    test('should create contact', async () => {
        const result = await DBHelper.createContact(1,'tester1','personal');
        expect(result).toBeGreaterThan(0);
    });

});