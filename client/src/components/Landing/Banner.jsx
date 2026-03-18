// components/Banner.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AlertTriangle, Car, Shield, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Banner = () => {
      const [activeModal, setActiveModal] = useState(null); // 'scam' | 'request' | 'stolen'
        const [stolenForm, setStolenForm] = useState({ make: '', model: '', plateNumber: '', vin: '', color: '', stolenDate: '', description: '' });
        
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

          const submitStolen = async () => {
            if (!stolenForm.plateNumber.trim() && !stolenForm.vin.trim()) {
              toast.error('Plate number or VIN is required');
              return;
            }
        
            setLoading(true);
            setError("");
        
            try {
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/stolen`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json', 
                  Authorization: `Bearer ${localStorage.getItem('token') || ''}` 
                },
                body: JSON.stringify(stolenForm),
              });
        
              const data = await res.json();
        
              if (res.ok) {
                toast.success('Stolen car reported nationwide!');
                setActiveModal(null);
                setStolenForm({ make: '', model: '', plateNumber: '', vin: '', color: '', stolenDate: '', description: '' });
              } else {
                const errorMsg = data?.error || data?.message || 'Failed to report stolen car';
                toast.error(errorMsg);
                setError(errorMsg);
              }
            } catch (err) {
              console.error("Stolen report error:", err);
              const errorMsg = err.message || 'Failed to report stolen car';
              toast.error(errorMsg);
              setError(errorMsg);
            } finally {
              setLoading(false);
            }
          };
        
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[680px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
      {/* Dark cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1f] via-[#000814] to-[#0a0014]"></div>

      {/* Background image with subtle zoom & opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-110 transition-transform duration-[18s] hover:scale-105"
        style={{
          backgroundImage:
            "url('https://thumbs.dreamstime.com/b/black-sports-car-drifting-wet-city-street-night-scene-glowing-red-taillights-motion-effect-urban-environment-performance-vehicle-437908555.jpg')",
          // Alternative strong options:
          // "url('https://thumbs.dreamstime.com/b/black-sports-car-driving-tunnel-night-futuristic-glowing-red-blue-lights-captured-motion-neon-lit-332093672.jpg')"
        }}
      />

      {/* Subtle tech overlay glows */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_25%,rgba(255,45,85,0.08),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(0,212,255,0.07),transparent_45%)]" />

      {/* Main content */}
      <div className="relative z-10 text-center px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_40px_rgba(255,45,85,0.4)] animate-fade-in">
          Detect a Stolen Car
          <br className="sm:hidden" /> in Seconds
        </h1>

        <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl text-cyan-100/85 font-light tracking-wide max-w-3xl mx-auto">
           • Detect stolen cars anywhere in the world 
        </p>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-center">
          {/* Primary CTA - View Stolen Cars */}
          <Link to='/stolen-cars'>
            <button
            type="button"
            className="group relative px-9 py-5 text-lg md:text-xl font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 rounded-full shadow-xl shadow-red-900/40 hover:shadow-red-700/60 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">View Stolen Cars Now</span>
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          </Link>
        

          {/* Secondary CTA */}
          <button
            type="button"
                 onClick={() => setActiveModal('stolen')}
            className="group relative px-9 py-5 text-lg md:text-xl font-semibold text-white border-2 border-cyan-500/70 rounded-full hover:bg-cyan-950/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,212,255,0.35)] transform hover:scale-105 active:scale-95"
          >
             
              Report a Stolen Car
          </button>
        </div>
      </div>

      {/* Floating live status indicator */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 px-6 py-3 bg-black/50 backdrop-blur-lg rounded-full border border-red-600/30 shadow-lg animate-pulse-slow">
        <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-ping" />
        <span className="text-red-200 font-medium text-sm sm:text-base">
          Live stolen vehicle detection active
        </span>
      </div>


      
      {/* STOLEN CAR MODAL */}
      {activeModal === 'stolen' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg my-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-t-3xl text-white flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Shield className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Report Stolen Car</h2>
                    <p className="opacity-90 mt-1">Help recover your vehicle</p>
                  </div>
                </div>
                <button onClick={() => { setActiveModal(null); setError(""); }} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <input placeholder="Maker" value={stolenForm.make} onChange={e => setStolenForm({ ...stolenForm, make: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input placeholder="Model" value={stolenForm.model} onChange={e => setStolenForm({ ...stolenForm, model: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input placeholder="Plate Number" value={stolenForm.plateNumber} onChange={e => setStolenForm({ ...stolenForm, plateNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input placeholder="VIN (optional)" value={stolenForm.vin} onChange={e => setStolenForm({ ...stolenForm, vin: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input placeholder="Color" value={stolenForm.color} onChange={e => setStolenForm({ ...stolenForm, color: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input type="date" value={stolenForm.stolenDate} onChange={e => setStolenForm({ ...stolenForm, stolenDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <textarea placeholder="Last seen location, time, and any details..." rows="6" value={stolenForm.description} onChange={e => setStolenForm({ ...stolenForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none" />

              {error && <p className="text-red-600 font-medium text-center">{error}</p>}

              <div className="p-8 pt-6 bg-gray-50 dark:bg-gray-900 rounded-b-3xl flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={submitStolen}
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Reporting...
                    </>
                  ) : (
                    <>
                      <Shield className="h-6 w-6" />
                      Report Stolen Car
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


export default Banner;