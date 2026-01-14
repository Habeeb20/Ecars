import { useState, useEffect } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

const AdminSightings = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); // Assuming auth token is stored
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sighting/sightings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch sightings');
        }
        
        const data = await response.json();
        if (data.status === 'success') {
          setSightings(data.data.sightings || []);
        } else {
          setError(data.message || 'Failed to load sightings');
        }
      } catch (err) {
        setError(err.message || 'Error fetching sightings');
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading sightings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">
          Admin Sightings Dashboard
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Seen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sightings.length > 0 ? (
              sightings.map((sighting) => (
                <tr key={sighting._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{sighting.reportId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{sighting.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{sighting.phone}</td>
                  <td className="px-6 py-4 text-sm">{sighting.locationSeen}</td>
                  <td className="px-6 py-4 text-sm line-clamp-3">{sighting.additionalInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(sighting.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No sightings reported yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSightings;