interface Customer {
    id: number;
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
    notes: string;
    createdBy: number;
    agentName: string;
    createdAt: string;
}
interface AgentCustomersTableProps {
    customers: Customer[];
    onViewDetails: (customer: Customer) => void;
}
export default function AgentCustomersTable({ customers, onViewDetails }: AgentCustomersTableProps): import("react/jsx-runtime").JSX.Element;
export {};
