
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 shadow-lg shadow-blue-500/20',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
