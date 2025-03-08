import { AxiosInstance } from 'axios';

declare module 'axios' {
  export interface AxiosInstance {
    agents: {
      getAll: () => Promise<any>;
      getById: (id: number) => Promise<any>;
      delete: (id: number) => Promise<any>;
      transferCustomers: (fromId: number, toId: number) => Promise<any>;
    };
    stats: {
      get: () => Promise<any>;
    };
  }
}
