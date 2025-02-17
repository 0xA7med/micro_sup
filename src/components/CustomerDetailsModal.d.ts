import type { Customer } from '../db/database';
interface CustomerDetailsModalProps {
    customer: Customer;
    onClose: () => void;
}
export default function CustomerDetailsModal({ customer, onClose, }: CustomerDetailsModalProps): import("react/jsx-runtime").JSX.Element;
export {};
