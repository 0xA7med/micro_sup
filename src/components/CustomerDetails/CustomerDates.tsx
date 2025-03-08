import React from 'react';
import { format, parseISO } from 'date-fns';
import CustomerField from './CustomerField';

interface CustomerDatesProps {
  startDate: string;
  endDate: string;
}

export default function CustomerDates({ startDate, endDate }: CustomerDatesProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  return (
    <>
      <CustomerField label="تاريخ البداية">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {formatDate(startDate)}
        </p>
      </CustomerField>

      <CustomerField label="تاريخ النهاية">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {formatDate(endDate)}
        </p>
      </CustomerField>
    </>
  );
}