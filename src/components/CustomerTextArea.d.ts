import React from 'react';
interface CustomerTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    isEditing: boolean;
    value: string;
    displayValue?: string;
}
declare const CustomerTextArea: React.ForwardRefExoticComponent<CustomerTextAreaProps & React.RefAttributes<HTMLTextAreaElement>>;
export default CustomerTextArea;
