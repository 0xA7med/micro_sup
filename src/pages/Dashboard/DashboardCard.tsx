import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '../../components/ui/Card';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export default function DashboardCard({ title, value, icon: Icon, color, onClick }: DashboardCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full transition-shadow duration-200 hover:shadow-lg"
    >
      <Card className="p-4 sm:p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon
              className={`h-5 w-5 sm:h-6 sm:w-6 text-white p-1 rounded-full ${color}`}
            />
          </div>
          <div className="ml-3 sm:ml-5 w-0 flex-1">
            <dl>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </Card>
    </button>
  );
}