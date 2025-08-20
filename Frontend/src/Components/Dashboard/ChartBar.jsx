import React from 'react';

const ChartBar = ({ label, percentage, value, color }) => {
  return (
    <div className="flex items-center">
      <span className="w-20 text-sm text-gray-600">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
        <div 
          className={`${color} h-6 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="ml-4 text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
};

export default ChartBar;
