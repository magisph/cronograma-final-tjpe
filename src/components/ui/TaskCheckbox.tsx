import { Check } from 'lucide-react';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function TaskCheckbox({ checked, onChange, label }: TaskCheckboxProps) {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleClick}
      className={`
        flex items-center gap-3 min-h-[48px] min-w-[48px] 
        p-2 rounded-xl transition-colors duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-1
        hover:bg-gray-100 active:bg-gray-200
        ${checked ? 'text-emerald-700' : 'text-gray-700'}
      `}
    >
      <div 
        className={`
          flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-150
          ${checked ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-gray-400'}
        `}
      >
        {checked && <Check size={16} className="text-white" />}
      </div>
      
      {label && (
        <span className={`text-sm md:text-base font-medium transition-colors ${checked ? 'line-through text-gray-500' : ''}`}>
          {label}
        </span>
      )}
    </button>
  );
}
