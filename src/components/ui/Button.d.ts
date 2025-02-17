import React from 'react';
import { LucideIcon } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}
export default function Button({ children, variant, size, icon: Icon, iconPosition, className, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
