import React from 'react';
import { Copy, Check } from 'lucide-react';
import CustomerField from './CustomerField';
import CustomerInput from '../CustomerInput';
import Button from '../ui/Button';

interface CustomerBasicInfoProps {
  customer: any;
  isEditing: boolean;
  copiedCode: number | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCopyCode: (code: string, id: number) => void;
}

export default function CustomerBasicInfo({
  customer,
  isEditing,
  copiedCode,
  handleChange,
  handleCopyCode
}: CustomerBasicInfoProps) {
  return (
    <>
      <CustomerField label="اسم العميل">
        <CustomerInput
          type="text"
          name="customer_name"
          value={customer.customer_name}
          onChange={handleChange}
          isEditing={isEditing}
        />
      </CustomerField>

      <CustomerField label="اسم المنشأة">
        <CustomerInput
          type="text"
          name="business_name"
          value={customer.business_name}
          onChange={handleChange}
          isEditing={isEditing}
        />
      </CustomerField>

      <CustomerField label="نوع النشاط">
        <CustomerInput
          type="text"
          name="business_type"
          value={customer.business_type}
          onChange={handleChange}
          isEditing={isEditing}
        />
      </CustomerField>

      <CustomerField label="رقم الهاتف">
        <CustomerInput
          type="tel"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          isEditing={isEditing}
        />
      </CustomerField>

      <CustomerField label="رمز التفعيل">
        <div className="flex items-center gap-2">
          <CustomerInput
            type="text"
            name="activation_code"
            value={customer.activation_code}
            onChange={handleChange}
            isEditing={isEditing}
            className="font-mono text-sm"
          />
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              icon={copiedCode === customer.id ? Check : Copy}
              onClick={() => handleCopyCode(customer.activation_code, customer.id)}
              className={copiedCode === customer.id ? 'text-green-500' : ''}
            />
          )}
        </div>
      </CustomerField>
    </>
  );
}