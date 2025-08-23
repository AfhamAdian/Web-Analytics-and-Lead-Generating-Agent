import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Main loading animation container */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
          {/* Outer glow effect */}
          <div className="absolute inset-0 w-20 h-20 border-2 border-orange-200 rounded-full mx-auto opacity-30 animate-pulse"></div>
        </div>
        
        {/* Loading text with gradient */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-3">
          Loading Dashboard
        </h2>
        <p className="text-gray-600 text-lg mb-6">Fetching your analytics data...</p>
        
        {/* Progress dots animation */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-3 h-3 bg-orange-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        
        {/* Loading steps indicator */}
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Authenticating user</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Loading sites and analytics</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Preparing dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
