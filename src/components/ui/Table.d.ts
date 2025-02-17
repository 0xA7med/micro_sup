interface TableProps {
    data: any[];
    columns: any[];
    searchValue: string;
    onSearchChange: (value: string) => void;
}
export default function Table({ data, columns, searchValue, onSearchChange }: TableProps): import("react/jsx-runtime").JSX.Element;
export {};
