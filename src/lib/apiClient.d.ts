declare const apiClient: import("axios").AxiosInstance;
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}
interface Agent {
    id: number;
    username: string;
    fullName: string;
    role: string;
    phone?: string;
    address?: string;
    customerCount: number;
}
interface Stats {
    totalCustomers: number;
    totalAgents: number;
    recentCustomers: Array<{
        id: number;
        name: string;
        createdAt: string;
    }>;
}
declare const agents: {
    getAll: () => Promise<ApiResponse<Agent[]>>;
    getById: (id: number) => Promise<ApiResponse<Agent>>;
    delete: (id: number) => Promise<ApiResponse>;
    transferCustomers: (fromId: number, toId: number) => Promise<ApiResponse>;
};
declare const stats: {
    get: () => Promise<ApiResponse<Stats>>;
};
export { apiClient, agents, stats };
