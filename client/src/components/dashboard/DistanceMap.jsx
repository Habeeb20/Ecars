// src/components/DistanceInfo.jsx (add static map)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Car, Clock, AlertCircle, Loader2 } from 'lucide-react';

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DistanceInfo = ({ clientAddressParts, providerAddressParts }) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildAddress = (parts) => {
    return Object.values(parts || {})
      .filter(Boolean)
      .join(', ')
      .trim() || 'Lagos, Nigeria';
  };

  useEffect(() => {
    const origin = buildAddress(clientAddressParts);
    const destination = buildAddress(providerAddressParts);

    if (origin === 'Lagos, Nigeria' && destination === 'Lagos, Nigeria') {
      setError('Location details not available');
      setLoading(false);
      return;
    }

    // Fetch distance & duration (your existing logic)
    const fetchDistance = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/distance`, {
          params: { origin, destination }
        });
  setDistance(res.data.distance);
          setDuration(res.data.duration);
   
      } catch (err) {
        console.log(err)
        setError('Unable to calculate distance');
      } finally {
        setLoading(false);
      }
    };

    fetchDistance();
  }, [clientAddressParts, providerAddressParts]);

  // Static map URL (shows route + markers)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=500x300&maptype=roadmap&markers=color:red%7Clabel:C%7C${encodeURIComponent(buildAddress(clientAddressParts))}&markers=color:blue%7Clabel:P%7C${encodeURIComponent(buildAddress(providerAddressParts))}&path=color:0x0000ff|weight:5|${encodeURIComponent(buildAddress(clientAddressParts))}|${encodeURIComponent(buildAddress(providerAddressParts))}&key=${GOOGLE_KEY}`;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Calculating route...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 italic flex items-center gap-2">
        <AlertCircle size={16} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Static map preview */}
 
{!loading && !error && (
  <iframe
    width="100%"
    height="350"
    style={{ border: 0 }}
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
    src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_KEY}&origin=${encodeURIComponent(buildAddress(clientAddressParts))}&destination=${encodeURIComponent(buildAddress(providerAddressParts))}&mode=driving`}
  />
)}

      {/* Text distance & time */}
      {/* <div className="flex flex-col sm:flex-row gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3">
          <MapPin className="text-blue-600" size={24} />
          <div>
            <p className="text-sm text-blue-700">Distance</p>
            <p className="text-xl font-bold text-blue-900">{distance}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Car className="text-green-600" size={24} />
          <div>
            <p className="text-sm text-green-700">Est. Drive Time</p>
            <p className="text-xl font-bold text-green-900">{duration}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DistanceInfo;
















































