import React from 'react';
interface CustomerSubscriptionInfoProps {
    customer: any;
    isEditing: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
export default function CustomerSubscriptionInfo({ customer, isEditing, handleChange }: CustomerSubscriptionInfoProps): import("react/jsx-runtime").JSX.Element;
export {};
