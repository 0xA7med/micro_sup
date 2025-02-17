import React from 'react';
interface CustomerBasicInfoProps {
    customer: any;
    isEditing: boolean;
    copiedCode: number | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCopyCode: (code: string, id: number) => void;
}
export default function CustomerBasicInfo({ customer, isEditing, copiedCode, handleChange, handleCopyCode }: CustomerBasicInfoProps): import("react/jsx-runtime").JSX.Element;
export {};
