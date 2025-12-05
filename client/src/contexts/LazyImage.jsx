/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const LazyImage = ({ src, alt, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Shimmer placeholder */}
      {isLoading && (
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300/6366f1/ffffff?text=No+Image';
          setIsLoading(false);
        }}
      />
    </div>
  );
};

// Add this to your global CSS (index.css or App.css)
const globalStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
  }
`;

export default LazyImage;