import React from 'react';
import { Filter, Check } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface FilterButtonProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function FilterButton({ label, options, value, onChange, icon }: FilterButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          value
            ? isDarkMode
              ? 'bg-indigo-900/20 border-indigo-500'
              : 'bg-indigo-50 border-indigo-200'
            : isDarkMode
            ? 'border-gray-600 hover:border-gray-500'
            : 'border-gray-300 hover:border-gray-400'
        } transition-colors duration-200`}
      >
        {React.isValidElement(icon) ? icon : icon || <Filter className="h-4 w-4" />}
        <span className={`text-sm ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {value ? selectedOption?.label : label}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-56 rounded-lg border shadow-lg ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-2">
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value === value ? '' : option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                    option.value === value
                      ? isDarkMode
                        ? 'bg-indigo-900/20 text-indigo-400'
                        : 'bg-indigo-50 text-indigo-700'
                      : isDarkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                  {option.value === value && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
