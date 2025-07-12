import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button 
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
