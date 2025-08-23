import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-gray-800">
            {showSuccess ? 'Site Added Successfully!' : 'Add New Site'}
          </h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto p-6">
        {showSuccess ? (
          // Success View
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Site Added Successfully!</h2>
              <p className="text-gray-600">
                Your site "<span className="font-medium">{siteName}</span>" has been added and is ready for tracking.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Installation Instructions</h3>
              <p className="text-gray-600 mb-4">
                Copy and paste the following tracking script into the &lt;head&gt; section of your website's HTML or into your Next.js layout file:
              </p>
              
              <div className="relative">
                <pre className="bg-gray-50 border rounded-lg p-4 text-sm overflow-x-auto">
                  <code>{trackingScript}</code>
                </pre>
                <button
                  onClick={handleCopyScript}
                  className="absolute top-2 right-2 flex items-center space-x-1 bg-white border rounded px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddAnother}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Another Site
              </button>
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          // Form View
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Site Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter site name"
                />
              </div>
              
              <div>
                <label htmlFor="siteDomain" className="block text-sm font-medium text-gray-700 mb-2">
                  Site Domain
                </label>
                <input
                  type="url"
                  id="siteDomain"
                  name="siteDomain"
                  value={formData.siteDomain}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Site
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
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