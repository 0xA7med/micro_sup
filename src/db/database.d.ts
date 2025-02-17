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
}
declare class AppDatabase extends Dexie {
    customers: Table<Customer>;
    users: Table<User>;
    constructor();
}
declare let db: AppDatabase;
export { db };
