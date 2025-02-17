import React from 'react';
interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    footer?: React.ReactNode;
}
export default function Modal({ title, children, onClose, footer }: ModalProps): import("react/jsx-runtime").JSX.Element;
export {};
