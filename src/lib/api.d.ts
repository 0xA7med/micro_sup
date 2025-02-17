interface CreateCustomerData {
    customerName: string;
    businessName: string;
    businessType: string;
    phone: string;
    address: string;
    activationCode: string;
    subscriptionType: string;
    versionType: string;
    deviceCount: number;
    subscriptionStart: string;
    subscriptionEnd: string;
    notes?: string;
    createdBy?: number;
    agentName: string;
}
export declare const api: {
    users: {
        create: (data: {
            username: string;
            password: string;
            fullName: string;
            role: string;
        }) => Promise<{
            phone: string | null;
            address: string | null;
            id: number;
            role: string;
            username: string;
            password: string;
            fullName: string;
            createdAt: Date;
            updatedAt: Date;
        }>;
        authenticate: (username: string, password: string) => Promise<{
            phone: string | null;
            address: string | null;
            id: number;
            role: string;
            username: string;
            fullName: string;
            createdAt: Date;
            updatedAt: Date;
        } | null>;
    };
    auth: {
        checkAdmin: () => Promise<any>;
        createAdmin: (data: {
            username: string;
            password: string;
            fullName: string;
            role: string;
        }) => Promise<any>;
        createAgent: (data: {
            username: string;
            password: string;
            fullName: string;
            phone: string;
            address: string;
            role: string;
        }) => Promise<any>;
        login: (data: {
            username: string;
            password: string;
        }) => Promise<any>;
    };
    agents: {
        getAll: () => Promise<any>;
        getById: (id: number) => Promise<any>;
        delete: (id: number) => Promise<any>;
        transferCustomers: (fromAgentId: number, toAgentId: number) => Promise<any>;
    };
    customers: {
        getAll: () => Promise<any>;
        getRecent: () => Promise<any>;
        getByAgent: (agentId: number) => Promise<any>;
        create: (data: CreateCustomerData) => Promise<any>;
        update: (id: number, data: Partial<CreateCustomerData>) => Promise<any>;
        delete: (id: number) => Promise<any>;
    };
    stats: {
        getAll: () => Promise<any>;
        get: () => Promise<any>;
    };
};
export {};
