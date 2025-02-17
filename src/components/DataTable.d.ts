interface DataTableProps {
    data: any[];
    columns: any[];
    searchValue: string;
    onSearchChange: (value: string) => void;
}
export default function DataTable({ data, columns, searchValue, onSearchChange }: DataTableProps): import("react/jsx-runtime").JSX.Element;
export {};
