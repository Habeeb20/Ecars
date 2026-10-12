import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const th = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
const td = 'px-6 py-4 text-sm';

const AdminSightings = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSightings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sighting/sightings`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sightings');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setSightings(data.data?.sightings || []);
        } else {
          setError(data.message || 'Failed to load sightings');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Error fetching sightings');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchSightings();
    return () => controller.abort();
  }, []);

  // reportId may be a populated object { _id, title, vin, plateNumber, status } or a plain string
  const renderReport = (report) => {
    if (!report) return <span className="text-gray-400">N/A</span>;
    if (typeof report !== 'object') return report;
    return (
      <div>
        <p className="font-medium text-gray-900">{report.title || report._id}</p>
        <p className="text-xs text-gray-500">
          Plate: {report.plateNumber || 'N/A'}
          {report.vin ? ` · VIN: ${report.vin}` : ''}
        </p>
        {report.status && <p className="text-xs capitalize text-gray-500">{report.status}</p>}
      </div>
    );
  };

  // Guards against any other field arriving as an object
  const text = (v) => {
    if (v === null || v === undefined || v === '') return '—';
    return typeof v === 'object' ? v.name || v.title || v._id || '—' : v;
  };

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
        <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Eye className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Admin Sightings Dashboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Vehicle Report</th>
              <th className={th}>Reporter Name</th>
              <th className={th}>Phone</th>
              <th className={th}>Location Seen</th>
              <th className={th}>Additional Info</th>
              <th className={th}>Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sightings.length > 0 ? (
              sightings.map((s) => (
                <tr key={s._id}>
                  <td className={td}>{renderReport(s.reportId)}</td>
                  <td className={`${td} whitespace-nowrap`}>{text(s.fullName)}</td>
                  <td className={`${td} whitespace-nowrap`}>{text(s.phone)}</td>
                  <td className={td}>{text(s.locationSeen)}</td>
                  <td className={`${td} max-w-xs`}>
                    <p className="line-clamp-3" title={typeof s.additionalInfo === 'string' ? s.additionalInfo : undefined}>
                      {text(s.additionalInfo)}
                    </p>
                  </td>
                  <td className={`${td} whitespace-nowrap`}>
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
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