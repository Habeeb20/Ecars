import React, { useState, useEffect } from 'react';
import im from "../../assets/Lexus_IS_Car_Toyota_Audi_Q7_PNG-removebg-preview.png";
import im1 from "../../assets/2026_Chevrolet_Trax_1RS-removebg-preview.png";
import im2 from "../../assets/Lexus_RX_Hybrid_Car_2018_Lexus_GS_450h_Hybrid_Vehicle_PNG-removebg-preview.png";

const AuctionBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [im, im1, im2];

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[550px] overflow-hidden rounded-3xl shadow-2xl">
      {/* Main Background Image */}
      <img
        src={im}
        alt="Luxury Car Auction"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

      <div className="relative h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full px-8 md:px-16">
          
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-6">
              <span className="text-yellow-400 text-sm font-semibold tracking-widest">🇳🇬 LIVE AUCTIONS</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Bid Smart.<br />
              Win Big.<br />
              <span className="text-yellow-400">Drive Home</span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-md">
              Nigeria’s #1 Premium Vehicle Auction Platform.<br />
              Luxury cars, SUVs, Trucks & more — available now.
            </p>

            <a
              href="https://auction.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all text-black font-semibold text-lg px-12 py-5 rounded-2xl shadow-xl w-fit"
            >
              Start Bidding Now →
            </a>

            <div className="mt-10 flex items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span>✅</span> Verified Vehicles
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span> Instant Bidding
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span> Secure Payments
              </div>
            </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-md">
              {/* Carousel Container */}
              <div className="relative h-[380px] w-[800px] overflow-hidden rounded-3xl shadow-2xl ">
                {slides.map((slide, index) => (
                  <img
                    key={index}
                    src={slide}
                    alt={`Car ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  />
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-3 mt-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-yellow-400 w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-white border border-white/30 hidden xl:block">
        <div className="flex gap-8">
          <div>
            <div className="text-4xl font-bold text-yellow-400">248</div>
            <div className="text-xs tracking-widest uppercase">Cars Live</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400">1.4k</div>
            <div className="text-xs tracking-widest uppercase">Active Bidders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionBanner;