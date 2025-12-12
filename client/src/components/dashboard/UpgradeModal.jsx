// /* eslint-disable no-unused-vars */
// // src/components/UpgradeModal.jsx
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { X, Building2, Wrench, CheckCircle2 } from 'lucide-react';

// const UpgradeModal = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState('choose'); // choose | dealer | service
//   const [form, setForm] = useState({});

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const endpoint = step === 'dealer' 
//         ? '/auth/upgrade-to-dealer'
//         : '/auth/upgrade-service-provider';

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success(`You're now a ${step === 'dealer' ? 'Dealer' : 'Service Provider'}!`);
//         onClose();
//         setTimeout(() => window.location.reload(), 1500);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error('Upgrade failed');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//           <h2 class="text-2xl font-bold">Upgrade Account</h2>
//           <button onClick={onClose}><X class="h-6 w-6" /></button>
//         </div>

//         {step === 'choose' && (
//           <div class="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <button
//               onClick={() => setStep('dealer')}
//               class="p-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
//             >
//               <Building2 class="h-20 w-20 text-blue-600 mx-auto mb-4" />
//               <h3 class="text-2xl font-bold">Become a Dealer</h3>
//               <p class="text-gray-600 mt-3">Sell multiple cars • Get verified badge</p>
//             </button>
//             <button
//               onClick={() => setStep('service')}
//               class="p-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
//             >
//               <Wrench class="h-20 w-20 text-purple-600 mx-auto mb-4" />
//               <h3 class="text-2xl font-bold">Service Provider</h3>
//               <p class="text-gray-600 mt-3">Mechanic • Panel Beater • Rewire</p>
//             </button>
//           </div>
//         )}

//         {step === 'dealer' && (
//           <div class="p-8 space-y-6">
//             <h3 class="text-xl font-bold">Dealer Registration</h3>
//             <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} class="input" />
//             <input placeholder="CAC/Registration Number" onChange={(e) => setForm({...form, businessRegistrationNumber: e.target.value})} class="input" />
//             <input placeholder="Business Address" onChange={(e) => setForm({...form, businessAddress: e.target.value})} class="input" />
//             <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} class="input" />
//             <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} class="input" />
//             <input placeholder="Phone Number" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} class="input" />
//             <button onClick={handleSubmit} class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
//               Submit for Approval
//             </button>
//           </div>
//         )}

//         {step === 'service' && (
//           <div class="p-8 space-y-6">
//             <h3 class="text-xl font-bold">Service Provider Registration</h3>
//             <select onChange={(e) => setForm({...form, type: e.target.value})} class="input">
//               <option value="">Select Service Type</option>
//               <option value="mechanic">Mechanic</option>
//               <option value="panel_beater">Panel Beater</option>
//               <option value="rewire">Rewire / Auto Electrician</option>
//               <option value="car_wash">Car Wash</option>
//             </select>
//             <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} class="input" />
//             <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} class="input" />
//             <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} class="input" />
//             <input placeholder="Phone/WhatsApp" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} class="input" />
//             <button onClick={handleSubmit} class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold">
//               Submit for Approval
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpgradeModal;



/* eslint-disable no-unused-vars */
// src/components/UpgradeModal.jsx
import { useState } from 'react';
import { toast } from 'sonner';
import { X, Building2, Wrench, CheckCircle2, Package } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choose'); // choose | dealer | service | carpart
  const [form, setForm] = useState({});

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      if (step === 'dealer') endpoint = '/auth/upgrade-to-dealer';
      else if (step === 'service') endpoint = '/auth/upgrade-service-provider';
      else if (step === 'carpart') endpoint = '/auth/upgrade-carpart-seller';

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`You're now a ${step === 'dealer' ? 'Dealer' : step === 'service' ? 'Service Provider' : 'Car Part Seller'}!`);
        onClose();
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err)
      toast.error('Upgrade failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Upgrade Account</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>

        {step === 'choose' && (
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setStep('dealer')}
              className="p-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
            >
              <Building2 className="h-20 w-20 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Become a Dealer</h3>
              <p className="text-gray-600 mt-3">Sell multiple cars • Get verified badge</p>
            </button>
            <button
              onClick={() => setStep('service')}
              className="p-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
            >
              <Wrench className="h-20 w-20 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Service Provider</h3>
              <p className="text-gray-600 mt-3">Mechanic • Panel Beater • Rewire</p>
            </button>
            <button
              onClick={() => setStep('carpart')}
              className="p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
            >
              <Package className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Car Part Seller</h3>
              <p className="text-gray-600 mt-3">Sell new & used parts • Verified badge</p>
            </button>
          </div>
        )}

        {step === 'dealer' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold">Dealer Registration</h3>
            <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
            <input placeholder="CAC/Registration Number" onChange={(e) => setForm({...form, businessRegistrationNumber: e.target.value})} className="input" />
            <input placeholder="Business Address" onChange={(e) => setForm({...form, businessAddress: e.target.value})} className="input" />
            <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
            <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
            <input placeholder="Phone Number" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
            <button onClick={handleSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
              Submit for Approval
            </button>
          </div>
        )}

        {step === 'service' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold">Service Provider Registration</h3>
            <select onChange={(e) => setForm({...form, type: e.target.value})} className="input">
              <option value="">Select Service Type</option>
              <option value="mechanic">Mechanic</option>
              <option value="panel_beater">Panel Beater</option>
              <option value="rewire">Rewire / Auto Electrician</option>
              <option value="car_wash">Car Wash</option>
            </select>
            <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
            <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
            <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
            <input placeholder="Phone/WhatsApp" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
            <button onClick={handleSubmit} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold">
              Submit for Approval
            </button>
          </div>
        )}

        {step === 'carpart' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold">Car Part Seller Registration</h3>
            <select onChange={(e) => setForm({...form, type: e.target.value})} className="input">
              <option value="">Select Parts Type</option>
              <option value="new-parts">New Parts Only</option>
              <option value="used-parts">Used Parts Only</option>
              <option value="both">New & Used Parts</option>
              <option value="other">Other</option>
            </select>
            <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
            <input placeholder="Business Address" onChange={(e) => setForm({...form, businessAddress: e.target.value})} className="input" />
            <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
            <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
            <input placeholder="Phone/WhatsApp" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
            <input placeholder="Website (optional)" onChange={(e) => setForm({...form, website: e.target.value})} className="input" />
            <input placeholder="Years of Experience" type="number" onChange={(e) => setForm({...form, yearsOfExperience: e.target.value})} className="input" />
            <button onClick={handleSubmit} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold">
              Submit for Approval
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;