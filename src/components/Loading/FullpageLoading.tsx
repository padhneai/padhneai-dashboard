import React from 'react';

const FullpageLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col animate-pulse p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Filters / Tabs */}
      <div className="flex gap-4">
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            <div className="flex gap-2 mt-2">
              <div className="h-3 w-8 bg-gray-300 rounded"></div>
              <div className="h-3 w-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullpageLoading;
