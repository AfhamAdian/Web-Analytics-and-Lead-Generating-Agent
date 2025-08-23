import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'orange' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    orange: 'border-gray-200 border-t-orange-500',
    blue: 'border-gray-200 border-t-blue-500',
    green: 'border-gray-200 border-t-green-500',
    gray: 'border-gray-200 border-t-gray-500'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
};

const LoadingIndicator = ({ 
  message = 'Loading...', 
  size = 'md',
  color = 'orange',
  showSpinner = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {showSpinner && <LoadingSpinner size={size} color={color} />}
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

export default LoadingIndicator;
export { LoadingSpinner };
