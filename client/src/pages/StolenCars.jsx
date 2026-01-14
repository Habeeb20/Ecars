

// import { useState, useEffect } from 'react';
// import { Search, AlertTriangle } from 'lucide-react';

// const StolenCars = () => {
//   const [filters, setFilters] = useState({
//     make: '',
//     model: '',
//     year: '',
//     location: '',
//     color: '',
//     status: '',
//   });
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const statuses = [
//     'Recently Reported',
//     'Under Investigation',
//     'Recovered',
//     'Case Closed',
//   ];

//   const colors = [
//     'Black',
//     'White',
//     'Silver',
//     'Gray',
//     'Red',
//     'Blue',
//     'Green',
//     'Other',
//   ];

//   const statusMap = {
//     pending: 'Recently Reported',
//     reviewed: 'Under Investigation',
//     resolved: 'Recovered',
//     rejected: 'Case Closed',
//   };

//   const reverseStatusMap = {
//     'recently reported': 'pending',
//     'under investigation': 'reviewed',
//     'recovered': 'resolved',
//     'case closed': 'rejected',
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         setLoading(true);
//         const queryParams = new URLSearchParams();
//         if (filters.make) queryParams.append('make', filters.make);
//         if (filters.model) queryParams.append('model', filters.model);
//         if (filters.year) queryParams.append('year', filters.year);
//         if (filters.location) queryParams.append('location', filters.location);
//         if (filters.color) queryParams.append('color', filters.color.toLowerCase());
//         if (filters.status) {
//           const backendStatus = reverseStatusMap[filters.status.toLowerCase()];
//           if (backendStatus) queryParams.append('status', backendStatus);
//         }
//         const url = `${import.meta.env.VITE_BACKEND_URL}/reports/stolencars?${queryParams.toString()}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data.status === 'success') {
//           setReports(data.data.reports || []);
//         } else {
//           setReports([]);
//         }
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//         setReports([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, [filters]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800">
//         <div className="flex items-center justify-center h-64">
//           <p className="text-lg text-gray-600 dark:text-gray-400">Loading stolen cars...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800">
//       <div className="flex items-center gap-3 mb-8">
//         <AlertTriangle className="h-8 w-8 text-red-500" />
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Stolen Cars Registry
//         </h1>
//       </div>

//       {/* Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Make
//             </label>
//             <input
//               type="text"
//               name="make"
//               className="input"
//               placeholder="Car make..."
//               value={filters.make}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Model
//             </label>
//             <input
//               type="text"
//               name="model"
//               className="input"
//               placeholder="Car model..."
//               value={filters.model}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Year
//             </label>
//             <input
//               type="text"
//               name="year"
//               className="input"
//               placeholder="Year..."
//               value={filters.year}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Location
//             </label>
//             <input
//               type="text"
//               name="location"
//               className="input"
//               placeholder="City, State..."
//               value={filters.location}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Color
//             </label>
//             <select
//               name="color"
//               className="input"
//               value={filters.color}
//               onChange={handleFilterChange}
//             >
//               <option value="">Any Color</option>
//               {colors.map(color => (
//                 <option key={color} value={color.toLowerCase()}>
//                   {color}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               className="input"
//               value={filters.status}
//               onChange={handleFilterChange}
//             >
//               <option value="">Any Status</option>
//               {statuses.map(status => (
//                 <option key={status} value={status.toLowerCase()}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Results */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reports.length > 0 ? (
//           reports.map((report) => (
//             <div key={report._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     {report.title}
//                   </h3>
//                   <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
//                     {statusMap[report.status] || report.status}
//                   </span>
//                 </div>
//                 <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                   {report.year && <p><strong>Year:</strong> {report.year}</p>}
//                   <p><strong>Color:</strong> {report.color}</p>
//                   <p><strong>License Plate:</strong> {report.plateNumber}</p>
//                   <p><strong>VIN:</strong> {report.vin}</p>
//                   <p><strong>Last Seen:</strong> {report.location}</p>
//                   <p><strong>Date Reported:</strong> {new Date(report.stolenDate || report.createdAt).toLocaleDateString()}</p>
//                 </div>
//                 <div className="mt-4 flex space-x-2">
//                   <button className="flex-1 btn btn-primary">
//                     Report Sighting
//                   </button>
//                   {/* <button className="flex-1 btn btn-secondary">
//                     More Details
//                   </button> */}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-12">
//             <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No stolen cars found
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400">
//               Try adjusting your filters or search terms
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StolenCars;

import { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';

const StolenCars = () => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    location: '',
    color: '',
    status: '',
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [sightingForm, setSightingForm] = useState({
    fullName: '',
    phone: '',
    locationSeen: '',
    additionalInfo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const statuses = [
    'Recently Reported',
    'Under Investigation',
    'Recovered',
    'Case Closed',
  ];

  const colors = [
    'Black',
    'White',
    'Silver',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Other',
  ];

  const statusMap = {
    pending: 'Recently Reported',
    reviewed: 'Under Investigation',
    resolved: 'Recovered',
    rejected: 'Case Closed',
  };

  const reverseStatusMap = {
    'recently reported': 'pending',
    'under investigation': 'reviewed',
    'recovered': 'resolved',
    'case closed': 'rejected',
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.make) queryParams.append('make', filters.make);
        if (filters.model) queryParams.append('model', filters.model);
        if (filters.year) queryParams.append('year', filters.year);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.color) queryParams.append('color', filters.color.toLowerCase());
        if (filters.status) {
          const backendStatus = reverseStatusMap[filters.status.toLowerCase()];
          if (backendStatus) queryParams.append('status', backendStatus);
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/sighting/stolencars?${queryParams.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
          setReports(data.data.reports || []);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSightingChange = (e) => {
    const { name, value } = e.target;
    setSightingForm(prev => ({ ...prev, [name]: value }));
  };

  const openSightingModal = (reportId) => {
    setSelectedReportId(reportId);
    setModalOpen(true);
    setSightingForm({
      fullName: '',
      phone: '',
      locationSeen: '',
      additionalInfo: '',
    });
  };

  const submitSighting = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token'); // Assuming auth is handled this way
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sighting/sightings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId: selectedReportId,
          ...sightingForm,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Sighting reported successfully!'); // Or use toast
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to report sighting');
      }
    } catch (error) {
      console.error('Error submitting sighting:', error);
      alert('Error reporting sighting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading stolen cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Stolen Cars Registry
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Make
            </label>
            <input
              type="text"
              name="make"
              className="input"
              placeholder="Car make..."
              value={filters.make}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <input
              type="text"
              name="model"
              className="input"
              placeholder="Car model..."
              value={filters.model}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <input
              type="text"
              name="year"
              className="input"
              placeholder="Year..."
              value={filters.year}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              className="input"
              placeholder="City, State..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <select
              name="color"
              className="input"
              value={filters.color}
              onChange={handleFilterChange}
            >
              <option value="">Any Color</option>
              {colors.map(color => (
                <option key={color} value={color.toLowerCase()}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              className="input"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Any Status</option>
              {statuses.map(status => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {statusMap[report.status] || report.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {report.year && <p><strong>Year:</strong> {report.year}</p>}
                  <p><strong>Color:</strong> {report.color}</p>
                  <p><strong>License Plate:</strong> {report.plateNumber}</p>
                  <p><strong>VIN:</strong> {report.vin}</p>
                  <p><strong>Last Seen:</strong> {report.location}</p>
                  <p><strong>Date Reported:</strong> {new Date(report.stolenDate || report.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => openSightingModal(report._id)}
                    className="flex-1 btn btn-primary"
                  >
                    Report Sighting
                  </button>
                  {/* <button className="flex-1 btn btn-secondary">
                    More Details
                  </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No stolen cars found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* Sighting Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Report Sighting</h2>
            <form onSubmit={submitSighting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={sightingForm.fullName}
                  onChange={handleSightingChange}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={sightingForm.phone}
                  onChange={handleSightingChange}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Where Was It Seen?
                </label>
                <input
                  type="text"
                  name="locationSeen"
                  value={sightingForm.locationSeen}
                  onChange={handleSightingChange}
                  required
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={sightingForm.additionalInfo}
                  onChange={handleSightingChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StolenCars;