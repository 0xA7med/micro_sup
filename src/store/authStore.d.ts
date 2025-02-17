interface User {
    id: number;
    username: string;
    fullName: string;
    role: string;
    createdAt: Date;
}
interface AuthStore {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>;
export {};
