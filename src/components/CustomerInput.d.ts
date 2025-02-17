import React from 'react';
interface CustomerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isEditing: boolean;
    value: string | number;
    displayValue?: string;
}
declare const CustomerInput: React.ForwardRefExoticComponent<CustomerInputProps & React.RefAttributes<HTMLInputElement>>;
export default CustomerInput;
