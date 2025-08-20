import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SiteDetails = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Mock site data - in real app, you'd fetch this based on siteId
  const siteData = {
    1: { name: 'Site 1', domain: 'example1.com' },
    2: { name: 'Site 2', domain: 'example2.com' },
    3: { name: 'Site 3', domain: 'example3.com' }
  };

  const site = siteData[siteId] || { name: 'Unknown Site', domain: 'unknown.com' };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{site.name}</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Site Analytics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <p className="text-gray-900">{site.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <p className="text-gray-900">{site.domain}</p>
            </div>
            <div className="mt-6">
              <p className="text-gray-600">Site analytics and details will go here...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetails;
