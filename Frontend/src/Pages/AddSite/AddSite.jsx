import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Plus, Globe, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Services/api'

const AddSite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    siteName: '',
    siteDomain: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingScript, setTrackingScript] = useState('');
  const [siteName, setSiteName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Site data:', formData);

    api.post('/addSite', formData)
      .then(response => {
        console.log('API response:', response.data);
        setTrackingScript(response.data.trackingScript);
        setSiteName(formData.siteName);
        setShowSuccess(true);
      })
      .catch(error => {
        console.error('Error adding site:', error);
        alert('Failed to add site. Please try again.');
      });
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(trackingScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy script: ', err);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setFormData({ siteName: '', siteDomain: '' });
    setTrackingScript('');
    setSiteName('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showSuccess ? 'Site Added Successfully!' : 'Add New Site'}
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6">
        {showSuccess ? (
          // Success View
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 inline-flex mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Site Added Successfully!</h2>
              <p className="text-gray-600 text-lg">
                Your site "<span className="font-semibold text-blue-600">{siteName}</span>" has been added and is ready for tracking.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-2" />
                Installation Instructions
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Copy and paste the following tracking script into the <code className="bg-gray-100 px-2 py-1 rounded text-sm">&lt;head&gt;</code> section of your website's HTML or into your Next.js layout file:
              </p>
              
              <div className="relative">
                <pre className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 text-sm overflow-x-auto leading-relaxed">
                  <code className="text-gray-800">{trackingScript}</code>
                </pre>
                <button
                  onClick={handleCopyScript}
                  className="absolute top-3 right-3 flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-gray-600" />
                      <span className="text-gray-700 font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddAnother}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                Add Another Site
              </button>
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Form View
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 inline-flex mb-4">
                <Plus size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Website</h2>
              <p className="text-gray-600">Start tracking your website analytics</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter site name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="siteDomain" className="block text-sm font-medium text-gray-700 mb-2">
                  Site Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="siteDomain"
                    name="siteDomain"
                    value={formData.siteDomain}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Add Site
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AddSite;