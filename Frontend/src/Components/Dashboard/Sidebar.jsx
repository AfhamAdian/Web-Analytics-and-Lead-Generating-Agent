import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sites }) => {
  const navigate = useNavigate();

  const handleSiteClick = (siteId) => {
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">My Sites</h2>
      </div>
      <div className="p-4">
        {sites.map((site) => (
          <div
            key={site.id}
            onClick={() => handleSiteClick(site.id)}
            className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
              site.active
                ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
            {site.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
