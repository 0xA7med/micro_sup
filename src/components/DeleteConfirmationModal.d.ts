interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (transferCustomers: boolean) => void;
    title: string;
    description: string;
    showTransferOption?: boolean;
    transferDescription?: string;
    isLoading?: boolean;
}
export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, description, showTransferOption, transferDescription, isLoading, }: DeleteConfirmationModalProps): import("react/jsx-runtime").JSX.Element;
export {};
