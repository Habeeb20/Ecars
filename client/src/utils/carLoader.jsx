import React from 'react';
import './CarLoader.css'; // We'll create this too

const CarLoader = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Background subtle gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>

      {/* Luxury Car Silhouette with Shine Effect */}
      <div className="relative">
        {/* Glowing Car */}
        <div className="car-container">
          <svg
            width="380"
            height="180"
            viewBox="0 0 380 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="car-svg drop-shadow-2xl"
          >
            {/* Car Body */}
            <path
              d="M50 100 Q 190 40, 330 100 L 340 140 Q 300 160, 240 160 L 140 160 Q 80 160, 40 140 Z"
              fill="#1a1a1a"
              stroke="#00ff99"
              strokeWidth="3"
            />
            {/* Windows */}
            <path
              d="M100 90 Q 190 60, 280 90 L 270 120 Q 190 100, 110 120 Z"
              fill="#0f172a"
              opacity="0.7"
            />
            {/* Headlights Glow */}
            <circle cx="70" cy="110" r="18" fill="#00ff99" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="310" cy="110" r="18" fill="#00ff99" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.4;0.9;0.4"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Moving Road Lines Below */}
        <div className="road-lines">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
        </div>
      </div>

      {/* Brand Text with Fade In + Pulse */}
      <div className="absolute bottom-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-widest">
          ECARS
        </h1>
        <p className="text-gray-400 mt-3 text-lg tracking-wider animate-pulse">
          Luxury in Motion...
        </p>
      </div>

      {/* Loading Dots */}
      <div className="absolute bottom-10 flex space-x-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CarLoader;