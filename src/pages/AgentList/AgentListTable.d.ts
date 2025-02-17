interface Agent {
    id: number;
    username: string;
    fullName: string;
    phone: string;
    address: string;
    createdAt: string;
    customerCount: number;
}
interface AgentListTableProps {
    agents: Agent[];
    onDeleteClick: (agent: Agent) => void;
}
export default function AgentListTable({ agents, onDeleteClick }: AgentListTableProps): import("react/jsx-runtime").JSX.Element;
export {};
