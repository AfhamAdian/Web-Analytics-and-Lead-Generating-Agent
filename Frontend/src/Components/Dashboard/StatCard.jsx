import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default StatCard;
