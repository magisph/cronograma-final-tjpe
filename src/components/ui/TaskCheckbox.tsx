import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function TaskCheckbox({ checked, onChange, label }: TaskCheckboxProps) {
  // Optimistic local state for immediate feedback
  const [localChecked, setLocalChecked] = useState(checked);

  // Sync with prop when it changes (e.g., from server/store)
  useEffect(() => {
    setLocalChecked(checked);
  }, [checked]);

  const handleClick = () => {
    const nextState = !localChecked;
    setLocalChecked(nextState);
    // Let the parent/store know, which may take time, but local UI is already updated
    onChange(nextState);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={localChecked}
      onClick={handleClick}
      className={`
        flex items-center gap-3 min-h-[48px] min-w-[48px] 
        p-2 rounded-xl transition-colors duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-1
        hover:bg-gray-100 active:bg-gray-200
        ${localChecked ? 'text-emerald-700' : 'text-gray-700'}
      `}
    >
      <div 
        className={`
          flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-150
          ${localChecked ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-gray-400'}
        `}
      >
        {localChecked && <Check size={16} className="text-white" />}
      </div>
      
      {label && (
        <span className={`text-sm md:text-base font-medium transition-colors ${localChecked ? 'line-through text-gray-500' : ''}`}>
          {label}
        </span>
      )}
    </button>
  );
}
