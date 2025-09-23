// components/ui/SkeletonGrid.tsx
import React from 'react';

interface SkeletonGridProps {
  count?: number; // Number of skeleton items
  className?: string; // Additional styling
}

const DataDisplayLoading: React.FC<SkeletonGridProps> = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg animate-pulse bg-white shadow-sm"
        >
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-3 w-10 bg-gray-300 rounded"></div>
            <div className="h-3 w-12 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataDisplayLoading;
