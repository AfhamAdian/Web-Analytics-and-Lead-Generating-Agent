import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, BarChart3 } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            <div className="bg-blue-100 rounded-full p-4 animate-bounce" style={{animationDelay: '0ms'}}>
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <div className="bg-purple-100 rounded-full p-4 animate-bounce" style={{animationDelay: '200ms'}}>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Suggestions */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-800 mb-2">Here's what you can do:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check the URL for any typos</li>
              <li>• Go back to the previous page</li>
              <li>• Visit your dashboard</li>
              <li>• Use the navigation menu</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
          >
            <Home size={18} />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Still having trouble? Contact support at{' '}
            <a href="mailto:support@analytics.com" className="text-blue-600 hover:text-blue-700 underline">
              support@analytics.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
