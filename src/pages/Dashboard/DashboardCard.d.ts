import { LucideIcon } from 'lucide-react';
interface DashboardCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    onClick: () => void;
}
export default function DashboardCard({ title, value, icon: Icon, color, onClick }: DashboardCardProps): import("react/jsx-runtime").JSX.Element;
export {};
