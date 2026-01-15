// /* eslint-disable no-unused-vars */
// // components/ReportAndRequestSection.jsx
// import { useState } from 'react';
// import { AlertTriangle, Car, Shield, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
// import { toast } from 'sonner';

// const ReportAndRequestSection = () => {
//   const [activeModal, setActiveModal] = useState(null); // 'scam' | 'request' | 'stolen'

//   // Shared state for all forms
//   const [scamForm, setScamForm] = useState({ title: '', description: '', phone: '', evidence: [] });
//   const [requestForm, setRequestForm] = useState({ desiredMake: '', desiredModel: '', budget: '', preferredLocation: '', description: '' });
//   const [stolenForm, setStolenForm] = useState({ make: '', model: '', plateNumber: '', vin: '', color: '', stolenDate: '', description: '' });
// const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false);

//   // Cloudinary Upload
//   const uploadEvidence = async (e) => {
//     const files = Array.from(e.target.files);
//     setLoading(true);

//     const uploadPromises = files.map(async (file) => {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//       const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await res.json();
//       return data.secure_url;
//     });

//     try {
//       const urls = await Promise.all(uploadPromises);
//       setScamForm(prev => ({ ...prev, evidence: [...prev.evidence, ...urls] }));
//       toast.success(`${urls.length} image(s) uploaded`);
//     } catch (err) {
//       toast.error('Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit Handlers
//   const submitScam = async () => {
//     if (!scamForm.description) return toast.error('Description required');
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/scam`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: JSON.stringify(scamForm),
//       });
//       if (res.ok) {
//         toast.success('Scam reported successfully!');
//         setActiveModal(null);
//         setScamForm({ title: '', description: '', phone: '', evidence: [] });
//       }
//     } catch (err) {
//       console.log(err)
//       setError(err)
//       alert("failed to submit please login")
//       toast.error( res.data.error || 'Failed to submit please login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitRequest = async () => {
//     if (!requestForm.desiredMake || !requestForm.budget) return toast.error('Make & budget required');
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/request`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: JSON.stringify(requestForm),
//       });
//       if (res.ok) {
//         toast.success('Request sent to all dealers!');
//         setActiveModal(null);
//         setRequestForm({ desiredMake: '', desiredModel: '', budget: '', preferredLocation: '', description: '' });
//       }
//     } catch (err) {
//       toast.error('Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitStolen = async () => {
//     if (!stolenForm.plateNumber && !stolenForm.vin) return toast.error('Plate number or VIN required');
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/stolen`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
//         body: JSON.stringify(stolenForm),
//       });
//       if (res.ok) {
//         toast.success('Stolen car reported nationwide!');
//         setActiveModal(null);
//         setStolenForm({ make: '', model: '', plateNumber: '', vin: '', color: '', stolenDate: '', description: '' });
//       }
//     } catch (err) {
//       alert("failed")
//       toast.error('Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <section className="py-12 bg-gray-50 dark:bg-gray-900">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Report Scam Card */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
//                  onClick={() => setActiveModal('scam')}>
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <AlertTriangle className="h-6 w-6 text-red-500" />
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     Report a Car Deal Scam
//                   </h3>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   Have you been the victim of a car deal scam? We're here to help. Report suspicious activities and protect other buyers.
//                 </p>
//                 <span className="inline-flex items-center text-red-600 hover:text-red-700 font-medium">
//                   File a Report
//                 </span>
//               </div>
//             </div>

//             {/* Make Request Card */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
//                  onClick={() => setActiveModal('request')}>
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Car className="h-6 w-6 text-primary-500" />
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                     Make a Request
//                   </h3>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   Can't find what you're looking for? Let us know your requirements and we'll help you find the perfect match.
//                 </p>
//                 <span className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
//                   Submit Request
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Add Stolen Car Card (Optional) */}
//           <div className="mt-8 text-center">
//             <button
//               onClick={() => setActiveModal('stolen')}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
//             >
//               <Shield className="h-5 w-5" />
//               Report a Stolen Car
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* REPORT SCAM MODAL */}
//       {activeModal === 'scam' && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 rounded-t-3xl text-white">
//               <div className="flex justify-between items-start">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-white/20 rounded-2xl">
//                     <AlertTriangle className="h-10 w-10" />
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-bold">Report Scam Deal</h2>
//                     <p className="opacity-90">Your report helps keep the community safe</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-xl">
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-8 space-y-6">
//               <input
//                 placeholder="Report Title"
//                 value={scamForm.title}
//                 onChange={e => setScamForm({ ...scamForm, title: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//               />
//               <textarea
//                 rows="6"
//                 placeholder="Describe what happened in detail..."
//                 value={scamForm.description}
//                 onChange={e => setScamForm({ ...scamForm, description: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//               />
//               <input
//                 type="tel"
//                 placeholder="Your phone number (optional)"
//                 value={scamForm.phone}
//                 onChange={e => setScamForm({ ...scamForm, phone: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//               />
//               <div>
//                 <label className="block text-sm font-medium mb-3">Upload Evidence</label>
//                 <input type="file" multiple accept="image/*" onChange={uploadEvidence} className="hidden" id="scam-evidence" />
//                 <label htmlFor="scam-evidence" className="cursor-pointer w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-red-500 transition">
//                   {loading ? <Loader2 className="h-10 w-10 animate-spin mx-auto" /> : <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />}
//                   <p>Click to upload screenshots</p>
//                 </label>
//                 {scamForm.evidence.length > 0 && (
//                   <div className="grid grid-cols-4 gap-3 mt-4">
//                     {scamForm.evidence.map((url, i) => (
//                       <img key={i} src={url} className="h-24 rounded-lg border" />
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={submitScam}
//                 disabled={loading}
//                 className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-3"
//               >
//                 {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AlertTriangle className="h-6 w-6" />}
//                 Submit Report
//               </button>

//               {error && <p className='text-red-500'>{error}</p>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* REQUEST MODAL */}
//     {/* CAR REQUEST MODAL */}
// {activeModal === 'request' && (
//   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
//     <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg my-8 shadow-2xl max-h-[90vh] flex flex-col">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-t-3xl text-white flex-shrink-0">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 rounded-2xl">
//               <Car className="h-10 w-10" />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold">I Want This Car!</h2>
//               <p className="opacity-90 mt-1">Tell dealers exactly what you need</p>
//             </div>
//           </div>
//           <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-xl transition">
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Body */}
//       <div className="flex-1 overflow-y-auto p-8 space-y-6">
//         <input
//           placeholder="Car Make (e.g. Toyota)"
//           value={requestForm.desiredMake}
//           onChange={e => setRequestForm({ ...requestForm, desiredMake: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
//         />
//         <input
//           placeholder="Model (e.g. Camry)"
//           value={requestForm.desiredModel}
//           onChange={e => setRequestForm({ ...requestForm, desiredModel: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//         />
//         <input
//           type="number"
//           placeholder="Your Budget (₦)"
//           value={requestForm.budget}
//           onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//         />
//         <input
    
//           placeholder="Preferred Location (e.g. Lagos, Abuja)"
//           value={requestForm.preferredLocation}
//           onChange={e => setRequestForm({ ...requestForm, preferredLocation: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//         />
//         <textarea
//           placeholder="Any special request? (year, color, condition...)"
//           rows="5"
//           value={requestForm.description}
//           onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
//         />

//         {/* Fixed Footer */}
//         <div className="p-8 pt-6 bg-gray-50 dark:bg-gray-900 rounded-b-3xl flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
//           <button
//             onClick={submitRequest}
//             disabled={loading}
//             className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="h-6 w-6 animate-spin" />
//                 Sending Request...
//               </>
//             ) : (
//               <>
//                 <CheckCircle2 className="h-6 w-6" />
//                 Send Request to Dealers
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//       {/* STOLEN CAR MODAL */}
//    {/* STOLEN CAR MODAL */}
// {activeModal === 'stolen' && (
//   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
//     <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg my-8 shadow-2xl max-h-[90vh] flex flex-col">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-t-3xl text-white flex-shrink-0">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 rounded-2xl">
//               <Shield className="h-10 w-10" />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold">Report Stolen Car</h2>
//               <p className="opacity-90 mt-1">Help recover your vehicle</p>
//             </div>
//           </div>
//           <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-xl transition">
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Body */}
//       <div className="flex-1 overflow-y-auto p-8 space-y-6">
//         <input placeholder="Make" value={stolenForm.make} onChange={e => setStolenForm({ ...stolenForm, make: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <input placeholder="Model" value={stolenForm.model} onChange={e => setStolenForm({ ...stolenForm, model: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <input placeholder="Plate Number" value={stolenForm.plateNumber} onChange={e => setStolenForm({ ...stolenForm, plateNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <input placeholder="VIN (optional)" value={stolenForm.vin} onChange={e => setStolenForm({ ...stolenForm, vin: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <input placeholder="Color" value={stolenForm.color} onChange={e => setStolenForm({ ...stolenForm, color: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <input type="date" value={stolenForm.stolenDate} onChange={e => setStolenForm({ ...stolenForm, stolenDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
//         <textarea
//           placeholder="Last seen location, time, and any details..."
//           rows="6"
//           value={stolenForm.description}
//           onChange={e => setStolenForm({ ...stolenForm, description: e.target.value })}
//           className="w-full px-4 py-3 rounded-xl border resize-none"
//         />

//         {/* Fixed Footer */}
//         <div className="p-8 pt-6 bg-gray-50 dark:bg-gray-900 rounded-b-3xl flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
//           <button
//             onClick={submitStolen}
//             disabled={loading}
//             className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="h-6 w-6 animate-spin" />
//                 Reporting...
//               </>
//             ) : (
//               <>
//                 <Shield className="h-6 w-6" />
//                 Report Stolen Car
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//     </>
//   );
// };

// export default ReportAndRequestSection;


/* eslint-disable no-unused-vars */
// components/ReportAndRequestSection.jsx
import { useState } from 'react';
import { AlertTriangle, Car, Shield, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ReportAndRequestSection = () => {
  const [activeModal, setActiveModal] = useState(null); // 'scam' | 'request' | 'stolen'

  // Shared state for all forms
  const [scamForm, setScamForm] = useState({ title: '', description: '', phone: '', evidence: [] });
  const [requestForm, setRequestForm] = useState({ desiredMake: '', desiredModel: '', budget: '', preferredLocation: '', description: '' });
  const [stolenForm, setStolenForm] = useState({ make: '', model: '', plateNumber: '', vin: '', color: '', stolenDate: '', description: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // for displaying errors in UI

  // Cloudinary Upload
  const uploadEvidence = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError("");

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        
        const data = await res.json();
        if (!data.secure_url) throw new Error('No secure_url received');
        
        return data.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        throw err;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setScamForm(prev => ({ ...prev, evidence: [...prev.evidence, ...urls] }));
      toast.success(`${urls.length} image${urls.length !== 1 ? 's' : ''} uploaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload images');
      setError('Image upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handlers
  const submitScam = async () => {
    if (!scamForm.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/scam`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token') || ''}` 
        },
        body: JSON.stringify(scamForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Scam reported successfully!');
        setActiveModal(null);
        setScamForm({ title: '', description: '', phone: '', evidence: [] });
      } else {
        const errorMsg = data?.error || data?.message || 'Failed to submit report';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Scam report error:", err);
      const errorMsg = err.message || 'Network error - please check your connection';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    if (!requestForm.desiredMake.trim() || !requestForm.budget) {
      toast.error('Make and budget are required');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reports/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token') || ''}` 
        },
        body: JSON.stringify(requestForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Request sent to all dealers!');
        setActiveModal(null);
        setRequestForm({ desiredMake: '', desiredModel: '', budget: '', preferredLocation: '', description: '' });
      } else {
        const errorMsg = data?.error || data?.message || 'Failed to send request';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Request error:", err);
      const errorMsg = err.message || 'Failed to send request';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
    <>
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Report Scam Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => setActiveModal('scam')}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Report a Car Deal Scam
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Have you been the victim of a car deal scam? We're here to help. Report suspicious activities and protect other buyers.
                </p>
                <span className="inline-flex items-center text-red-600 hover:text-red-700 font-medium">
                  File a Report
                </span>
              </div>
            </div>

            {/* Make Request Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => setActiveModal('request')}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="h-6 w-6 text-primary-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Make a Request
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Can't find what you're looking for? Let us know your requirements and we'll help you find the perfect match.
                </p>
                <span className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                  Submit Request
                </span>
              </div>
            </div>
          </div>

          {/* Add Stolen Car Card (Optional) */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveModal('stolen')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
            >
              <Shield className="h-5 w-5" />
              Report a Stolen Car
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────── */}
      {/*                  MODALS                          */}
      {/* ──────────────────────────────────────────────── */}

      {/* REPORT SCAM MODAL */}
      {activeModal === 'scam' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 rounded-t-3xl text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <AlertTriangle className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Report Scam Deal</h2>
                    <p className="opacity-90">Your report helps keep the community safe</p>
                  </div>
                </div>
                <button onClick={() => { setActiveModal(null); setError(""); }} className="p-2 hover:bg-white/20 rounded-xl">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <input
                placeholder="Report Title"
                value={scamForm.title}
                onChange={e => setScamForm({ ...scamForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <textarea
                rows="6"
                placeholder="Describe what happened in detail..."
                value={scamForm.description}
                onChange={e => setScamForm({ ...scamForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="tel"
                placeholder="Your phone number (optional)"
                value={scamForm.phone}
                onChange={e => setScamForm({ ...scamForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <div>
                <label className="block text-sm font-medium mb-3">Upload Evidence</label>
                <input type="file" multiple accept="image/*" onChange={uploadEvidence} className="hidden" id="scam-evidence" />
                <label htmlFor="scam-evidence" className="cursor-pointer w-full border-2 border-dashed rounded-xl p-8 text-center hover:border-red-500 transition">
                  {loading ? <Loader2 className="h-10 w-10 animate-spin mx-auto" /> : <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />}
                  <p>Click to upload screenshots</p>
                </label>
                {scamForm.evidence.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {scamForm.evidence.map((url, i) => (
                      <img key={i} src={url} alt="evidence" className="h-24 rounded-lg border object-cover" />
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-red-600 font-medium text-center">{error}</p>}

              <button
                onClick={submitScam}
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <AlertTriangle className="h-6 w-6" />}
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {activeModal === 'request' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg my-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-t-3xl text-white flex-shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Car className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">I Want This Car!</h2>
                    <p className="opacity-90 mt-1">Tell dealers exactly what you need</p>
                  </div>
                </div>
                <button onClick={() => { setActiveModal(null); setError(""); }} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <input placeholder="Car Make (e.g. Toyota)" value={requestForm.desiredMake} onChange={e => setRequestForm({ ...requestForm, desiredMake: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500" />
              <input placeholder="Model (e.g. Camry)" value={requestForm.desiredModel} onChange={e => setRequestForm({ ...requestForm, desiredModel: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input type="number" placeholder="Your Budget (₦)" value={requestForm.budget} onChange={e => setRequestForm({ ...requestForm, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <input placeholder="Preferred Location (e.g. Lagos, Abuja)" value={requestForm.preferredLocation} onChange={e => setRequestForm({ ...requestForm, preferredLocation: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
              <textarea placeholder="Any special request? (year, color, condition...)" rows="5" value={requestForm.description} onChange={e => setRequestForm({ ...requestForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none" />

              {error && <p className="text-red-600 font-medium text-center">{error}</p>}

              <div className="pt-6 bg-gray-50 dark:bg-gray-900 rounded-b-3xl flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={submitRequest}
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-6 w-6" />
                      Send Request to Dealers
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <input placeholder="Make" value={stolenForm.make} onChange={e => setStolenForm({ ...stolenForm, make: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
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
    </>
  );
};

export default ReportAndRequestSection;