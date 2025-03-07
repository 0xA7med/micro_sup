import { Dexie, type Table } from 'dexie';

export interface Customer {
  id?: number;
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  activationCode: string;
  subscriptionType: 'Monthly' | 'Semi-annual' | 'Annual' | 'Permanent';
  deviceCount: number;
  subscriptionStart: Date;
  subscriptionEnd: Date;
  notes: string;
  createdAt: Date;
  createdBy: number;
  agentName: string;
  versionType: 'android' | 'pc';
}

export interface User {
  id?: number;
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'representative';
  createdAt: Date;
  email?: string;
  phone?: string;
  address?: string;
}

class AppDatabase extends Dexie {
  customers!: Table<Customer>;
  users!: Table<User>;

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

    this.version(5).stores({
      customers: '++id, customerName, businessName, businessType, phone, activationCode, subscriptionEnd, subscriptionType, createdAt, createdBy, agentName, versionType',
      users: '++id, username, fullName, role, createdAt, email, phone, address'
    });

    // Handle version upgrades
    this.version(2).upgrade(transaction => {
      return transaction.table('customers').toCollection().modify((customer: Customer) => {
        if (!customer.businessType) customer.businessType = '';
        if (!customer.activationCode) customer.activationCode = '';
        if (!customer.subscriptionType) customer.subscriptionType = 'Monthly';
        if (!customer.createdAt) customer.createdAt = new Date();
        if (!customer.createdBy) customer.createdBy = 1;
        if (!customer.agentName) customer.agentName = 'admin';
      });
    });

    this.version(3).upgrade(transaction => {
      return transaction.table('customers').toCollection().modify((customer: Customer) => {
        if (!customer.versionType) customer.versionType = 'android';
      });
    });

    this.version(4).upgrade(transaction => {
      return transaction.table('customers').toCollection().modify((customer: Customer) => {
        if (customer.subscriptionType === 'Trial' as any) {
          customer.subscriptionType = 'Monthly';
        }
      });
    });

    this.version(5).upgrade(transaction => {
      return transaction.table('users').toCollection().modify((user: User) => {
        if (!user.email) user.email = '';
        if (!user.phone) user.phone = '';
        if (!user.address) user.address = '';
      });
    });

    // Initialize admin user if needed
    this.on('ready', async () => {
      try {
        const adminCount = await this.table('users').where('username').equals('admin').count();
        
        if (adminCount === 0) {
          await this.table('users').add({
            username: 'admin',
            password: 'admin123',
            fullName: 'مدير النظام',
            role: 'admin',
            createdAt: new Date(),
            email: '',
            phone: '',
            address: ''
          });
        }
      } catch (error) {
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
  } catch (error) {
    console.error('Error deleting old database:', error);
  }
};

// Initialize database
let db: AppDatabase;

const initDb = async () => {
  try {
    // Try to open the database
    db = new AppDatabase();
    await db.open();
  } catch (error: unknown) {
    console.error('Error opening database:', error);
    
    // If there's a version error, delete the old database and try again
    if (error instanceof Error && error.name === 'VersionError') {
      await deleteOldDatabase();
      db = new AppDatabase();
      await db.open();
    }
  }
};

// Initialize the database
initDb();

export { db };