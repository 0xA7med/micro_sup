import React from 'react';
interface CustomerSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    isEditing: boolean;
    value: string;
    displayValue?: string;
    children: React.ReactNode;
}
declare const CustomerSelect: React.ForwardRefExoticComponent<CustomerSelectProps & React.RefAttributes<HTMLSelectElement>>;
export default CustomerSelect;
