interface CustomerHeaderProps {
    title: string;
    isAdmin: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}
export default function CustomerHeader({ title, isAdmin, isEditing, onEdit, onDelete, onClose }: CustomerHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
