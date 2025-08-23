import React from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import ChartBar from './ChartBar';

const AnalyticsChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-12 translate-x-12 opacity-60"></div>
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600 text-sm">Detailed performance metrics</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">No Analytics Data</h3>
          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
            Analytics data will appear here once your tracking code starts collecting visitor information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-full translate-y-10 -translate-x-10 opacity-30"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="text-gray-600 text-sm">Detailed performance metrics</p>
          </div>
        </div>

        {/* Data Status Indicator */}
        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-gray-600 font-medium">{chartData.length} metrics</span>
        </div>
      </div>

      {/* Chart Data */}
      <div className="relative z-10 space-y-6">
        {chartData.map((data, index) => (
          <div 
            key={index}
            className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ChartBar
              label={data.label}
              percentage={data.percentage}
              value={data.value}
              color={data.color}there
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-60"></div>
    </div>
  );
};

export default AnalyticsChart;