import React from 'react';
interface CustomerFormData {
    customerName: string;
    businessName: string;
    businessType: string;
    phone: string;
    address: string;
    activationCode: string;
    subscriptionType: string;
    versionType: string;
    deviceCount: number;
    subscriptionStart: string;
    subscriptionEnd: string;
    notes: string;
    agentName: string;
}
interface CustomerFormProps {
    formData: CustomerFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onPaste: () => Promise<void>;
}
export default function CustomerForm({ formData, onChange, onSubmit, onPaste }: CustomerFormProps): import("react/jsx-runtime").JSX.Element;
export {};
