interface CustomerActionsProps {
    isEditing: boolean;
    onCancel: () => void;
    onSave: () => void;
}
export default function CustomerActions({ isEditing, onCancel, onSave }: CustomerActionsProps): import("react/jsx-runtime").JSX.Element | null;
export {};
