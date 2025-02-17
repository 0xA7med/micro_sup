interface AgentCustomersHeaderProps {
    agentName: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
}
export default function AgentCustomersHeader({ agentName, searchValue, onSearchChange }: AgentCustomersHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
