import React from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import Button from '../ui/Button';

interface CustomerHeaderProps {
  title: string;
  isAdmin: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function CustomerHeader({
  title,
  isAdmin,
  isEditing,
  onEdit,
  onDelete,
  onClose
}: CustomerHeaderProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="flex justify-between items-center">
      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <div className="flex gap-2">
        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={onEdit}
              className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={onDelete}
              className="!p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
            />
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onClose}
          className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        />
      </div>
    </div>
  );
}