interface CustomerDetailsProps {
    customer: any;
    onClose: () => void;
    isEditing?: boolean;
    onDelete?: (id: number) => Promise<void>;
}
export default function CustomerDetails({ customer: initialCustomer, onClose, isEditing: initialIsEditing, onDelete }: CustomerDetailsProps): import("react/jsx-runtime").JSX.Element;
export {};
