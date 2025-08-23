import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ExternalLink, BarChart3 } from 'lucide-react';

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

  const getRandomGradient = (siteName) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-purple-500 to-violet-600',
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-red-500 to-pink-600'
    ];
    let hash = 0;
    for (let i = 0; i < siteName.length; i++) {
      hash = siteName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                    <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">My Sites</h2>
                    <p className="text-xs text-gray-600">{sites?.length || 0} sites configured</p>
                </div>
            </div>
        </div>

        {/* Sites List */}
        <div className="p-4 space-y-3 pb-20">
            {sites && sites.length > 0 ? (
                sites.map((site) => (
                    <div
                        key={site.site_id}
                        onClick={() => handleSiteClick(site.site_id)}
                        className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isActiveSite(site.site_id)
                                ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border border-blue-200 shadow-sm'
                                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border border-transparent hover:border-gray-200'
                        }`}
                    >
                        {/* Site Icon/Avatar */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${getRandomGradient(site.site_name)}`}>
                            {getInitials(site.site_name)}
                        </div>
                        
                        {/* Site Info */}
                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className={`font-semibold text-sm truncate ${
                                    isActiveSite(site.site_id) ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-700'
                                } transition-colors duration-200`}>
                                    {site.site_name}
                                </h3>
                                <ExternalLink className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                                    isActiveSite(site.site_id) ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                                } transform group-hover:scale-110`} />
                            </div>
                            <div className="flex items-center mt-1.5">
                                <Globe className="h-3 w-3 text-gray-400 mr-1.5" />
                                <p className="text-xs text-gray-500 truncate">
                                    {site.domain_name}
                                </p>
                            </div>
                        </div>

                        {/* Active Indicator */}
                        {isActiveSite(site.site_id) && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-sm"></div>
                            </div>
                        )}

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 px-4">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No sites yet</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Add your first site to start tracking analytics and insights
                    </p>
                </div>
            )}
        </div>
    </div>
);
};

export default Sidebar;