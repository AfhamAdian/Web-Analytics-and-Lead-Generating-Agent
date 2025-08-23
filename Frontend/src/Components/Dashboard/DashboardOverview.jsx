import React from 'react';
import StatCard from './StatCard';
import { BarChart3, TrendingUp } from 'lucide-react';

const DashboardOverview = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
            <BarChart3 size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">No Analytics Data</h3>
          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
            Start tracking your website performance by adding sites and installing the tracking code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 text-sm">Real-time analytics insights</p>
          </div>
        </div>
        
        {/* Optional Status Indicator */}
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
    </div>
  );
};

export default DashboardOverview;