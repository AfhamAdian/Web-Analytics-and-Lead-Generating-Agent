import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ExternalLink, TrendingUp } from 'lucide-react';

const Sidebar = ({ sites }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSiteClick = (siteId) => {
    navigate(`/site/${siteId}`);
  };

  const isActiveSite = (siteId) => {
    return location.pathname === `/site/${siteId}`;
  };

  const getInitials = (siteName) => {
    return siteName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getRandomColor = (siteName) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    let hash = 0;
    for (let i = 0; i < siteName.length; i++) {
      hash = siteName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-800">My Sites</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">{sites?.length || 0} sites configured</p>
        </div>
        <div className="p-4 space-y-2">
            {sites && sites.length > 0 ? (
                sites.map((site) => (
                    <div
                        key={site.site_id}
                        onClick={() => handleSiteClick(site.site_id)}
                        className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isActiveSite(site.site_id)
                                ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm'
                                : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }`}
                    >
                        {/* Site Icon/Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${getRandomColor(site.site_name)}`}>
                            {getInitials(site.site_name)}
                        </div>
                        
                        {/* Site Info */}
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className={`font-semibold text-sm truncate ${
                                    isActiveSite(site.site_id) ? 'text-orange-700' : 'text-gray-800'
                                }`}>
                                    {site.site_name}
                                </h3>
                                <ExternalLink className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                                    isActiveSite(site.site_id) ? 'text-orange-500' : 'text-gray-400'
                                }`} />
                            </div>
                            <div className="flex items-center mt-1">
                                <Globe className="h-3 w-3 text-gray-400 mr-1" />
                                <p className="text-xs text-gray-500 truncate">
                                    {site.domain_name}
                                </p>
                            </div>
                        </div>

                        {/* Active Indicator */}
                        {isActiveSite(site.site_id) && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No sites configured</p>
                    <p className="text-gray-300 text-xs mt-1">Add your first site to get started</p>
                </div>
            )}
        </div>
        
        {/* Bottom section for additional info */}
        {sites && sites.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Total Sites: <span className="font-semibold text-gray-700">{sites.length}</span>
                    </p>
                </div>
            </div>
        )}
    </div>
);
};

export default Sidebar;
