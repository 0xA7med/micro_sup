import React from 'react';
interface LoginFormProps {
    isRegistering: boolean;
    formData: {
        username: string;
        password: string;
        confirmPassword: string;
        fullName: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    toggleMode: () => void;
}
export default function LoginForm({ isRegistering, formData, handleChange, handleSubmit, toggleMode, }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
export {};
