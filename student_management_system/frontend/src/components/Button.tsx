import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  disabled?: boolean;
  size?: 'sm' | 'md';
  icon?: string;
}

export default function Button({
  label, onClick, type = 'button', variant = 'primary',
  disabled = false, size = 'md', icon
}: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' };
  const variants = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:-translate-y-0.5',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
