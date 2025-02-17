import { Dexie } from 'dexie';
class AppDatabase extends Dexie {
    customers;
    users;
    constructor() {
        super('micropos_db');
        // Define all versions and their upgrades
        this.version(1).stores({
            customers: '++id, customerName, businessName, phone',
            users: '++id, username, role'
        });
        this.version(2).stores({
            customers: '++id, customerName, businessName, businessType, phone, activationCode, subscriptionEnd, subscriptionType, createdAt, createdBy, agentName',
            users: '++id, username, fullName, role, createdAt'
        });
        this.version(3).stores({
            customers: '++id, customerName, businessName, businessType, phone, activationCode, subscriptionEnd, subscriptionType, createdAt, createdBy, agentName, versionType',
            users: '++id, username, fullName, role, createdAt'
        });
        this.version(4).stores({
            customers: '++id, customerName, businessName, businessType, phone, activationCode, subscriptionEnd, subscriptionType, createdAt, createdBy, agentName, versionType',
            users: '++id, username, fullName, role, createdAt'
        });
        // Handle version upgrades
        this.version(2).upgrade(tx => {
            return tx.customers.toCollection().modify(customer => {
                if (!customer.businessType)
                    customer.businessType = '';
                if (!customer.activationCode)
                    customer.activationCode = '';
                if (!customer.subscriptionType)
                    customer.subscriptionType = 'Monthly';
                if (!customer.createdAt)
                    customer.createdAt = new Date();
                if (!customer.createdBy)
                    customer.createdBy = 1;
                if (!customer.agentName)
                    customer.agentName = 'admin';
            });
        });
        this.version(3).upgrade(tx => {
            return tx.customers.toCollection().modify(customer => {
                if (!customer.versionType)
                    customer.versionType = 'android';
            });
        });
        this.version(4).upgrade(tx => {
            return tx.customers.toCollection().modify(customer => {
                if (customer.subscriptionType === 'Trial')
                    customer.subscriptionType = 'Monthly';
            });
        });
        // Initialize admin user if needed
        this.on('ready', async () => {
            try {
                const adminCount = await this.users.where('username').equals('admin').count();
                if (adminCount === 0) {
                    await this.users.add({
                        username: 'admin',
                        password: 'admin123',
                        fullName: 'مدير النظام',
                        role: 'admin',
                        createdAt: new Date()
                    });
                }
            }
            catch (error) {
                console.error('Error initializing admin user:', error);
            }
        });
    }
}
// Delete the old database if it exists
const deleteOldDatabase = async () => {
    try {
        const databases = await window.indexedDB.databases();
        const oldDb = databases.find(db => db.name === 'micropos_db');
        if (oldDb) {
            await window.indexedDB.deleteDatabase('micropos_db');
        }
    }
    catch (error) {
        console.error('Error deleting old database:', error);
    }
};
// Initialize database
let db;
const initDb = async () => {
    try {
        // Try to open the database
        db = new AppDatabase();
        await db.open();
    }
    catch (error) {
        console.error('Error opening database:', error);
        // If there's a version error, delete the old database and try again
        if (error.name === 'VersionError') {
            await deleteOldDatabase();
            db = new AppDatabase();
            await db.open();
        }
    }
};
// Initialize the database
initDb();
export { db };
