export declare function useCustomers(filter?: 'expiring' | 'active'): {
    customers: {
        id: number;
        customer_name: string;
        business_name: string;
        business_type: string;
        phone: string;
        address: string;
        activation_code: string;
        subscription_type: string;
        device_count: number;
        subscription_start: string;
        subscription_end: string;
        notes?: string;
        created_at: string;
        created_by: number;
        agent_name: string;
        version_type: string;
    }[];
    loading: boolean;
};
