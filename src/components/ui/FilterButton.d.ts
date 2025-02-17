import React from 'react';
interface FilterButtonProps {
    label: string;
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}
export default function FilterButton({ label, options, value, onChange, icon }: FilterButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
