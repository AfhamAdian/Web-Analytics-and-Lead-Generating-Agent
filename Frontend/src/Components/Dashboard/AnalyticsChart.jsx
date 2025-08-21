import React from 'react';
import { BarChart3 } from 'lucide-react';
import ChartBar from './ChartBar';

const AnalyticsChart = ({ chartData }) => {
if (!chartData || chartData.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
                <BarChart3 className="text-gray-600 mr-2" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
            </div>
            <div className="text-gray-500 text-center py-8">
                No analytics data available.
            </div>
        </div>
    );
}

return (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
            <BarChart3 className="text-gray-600 mr-2" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
        </div>
        
        <div className="space-y-4">
            {chartData.map((data, index) => (
                <ChartBar 
                    key={index}
                    label={data.label}
                    percentage={data.percentage}
                    value={data.value}
                    color={data.color}
                />
            ))}
        </div>
    </div>
);
};

export default AnalyticsChart;
