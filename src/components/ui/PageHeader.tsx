import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface PageHeaderProps {
  title: string;
  backUrl?: string;
  backButton?: boolean;
  backButtonText?: string;
  backButtonLink?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  backUrl, 
  backButton, 
  backButtonText, 
  backButtonLink, 
  actions 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backButtonLink) {
      navigate(backButtonLink);
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {(backUrl || backButton) && (
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={handleBack}
            className="mr-4"
          >
            {backButtonText || "رجوع"}
          </Button>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}