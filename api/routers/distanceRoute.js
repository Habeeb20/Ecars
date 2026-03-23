

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import polyline from '@mapbox/polyline';

dotenv.config()
const router = express.Router();

router.get('/distance', async (req, res) => {
  const { origin, destination, decode = 'false' } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ 
      success: false,
      error: 'Origin and destination are required' 
    });
  }

  try {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL', // best traffic-aware route
        computeAlternativeRoutes: false,
        units: 'METRIC',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation',
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    if (!data.routes || data.routes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No route found',
        details: data,
      });
    }

    const route = data.routes[0];
    const leg = route.legs?.[0];

    // Optional: decode polyline server-side if requested
    let decodedPolyline = null;
    if (decode === 'true' && route.polyline?.encodedPolyline) {
      try {
        decodedPolyline = polyline.decode(route.polyline.encodedPolyline);
      } catch (decodeErr) {
        console.error('Polyline decode error:', decodeErr);
      }
    }

    res.json({
      success: true,
      origin: leg?.startLocation?.address || origin,
      destination: leg?.endLocation?.address || destination,
      distance: {
        meters: route.distanceMeters,
        km: (route.distanceMeters / 1000).toFixed(2),
        text: `${(route.distanceMeters / 1000).toFixed(1)} km`,
      },
      duration: {
        seconds: route.duration,
        text: formatDuration(route.duration),
      },
      polyline: {
        encoded: route.polyline?.encodedPolyline || null,
        decoded: decodedPolyline || null, // array of [lat, lng] if decode=true
      },
    });
  } catch (err) {
    console.error('Routes API Error:', err.message);
    if (err.response?.data) {
      return res.status(400).json({
        success: false,
        error: 'Google Routes API error',
        details: err.response.data.error?.message || err.response.data,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to calculate route',
      message: err.message,
    });
  }
});



function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  return `${mins} min`;
}
export default router;