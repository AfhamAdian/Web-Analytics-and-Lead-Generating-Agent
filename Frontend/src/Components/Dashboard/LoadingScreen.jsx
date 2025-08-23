import React from 'react';
import { BarChart3, Globe, TrendingUp } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        {/* Main loading animation container */}
        <div className="relative mb-8">
          {/* Outer rotating ring with gradient */}
          <div className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          {/* Inner icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3">
              <BarChart3 className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          {/* Outer glow effect */}
          <div className="absolute inset-0 w-24 h-24 border-2 border-blue-200 rounded-full mx-auto opacity-40 animate-pulse"></div>
        </div>
        
        {/* Loading text with gradient */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Loading Dashboard
        </h2>
        <p className="text-gray-600 text-lg mb-8">Preparing your analytics experience...</p>
        
        {/* Feature icons animation */}
        <div className="flex justify-center space-x-6 mb-8">
          <div className="bg-blue-100 rounded-full p-3 animate-bounce" style={{animationDelay: '0ms'}}>
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div className="bg-purple-100 rounded-full p-3 animate-bounce" style={{animationDelay: '200ms'}}>
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="bg-green-100 rounded-full p-3 animate-bounce" style={{animationDelay: '400ms'}}>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        {/* Loading steps indicator */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <div className="text-sm text-gray-600 space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Authentication verified</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Loading analytics data</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Finalizing dashboard</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
