


// /* eslint-disable no-unused-vars */
// // src/components/UpgradeModal.jsx



// import { useState } from 'react';
// import { toast } from 'sonner';
// import { X, Building2, Wrench, CheckCircle2, Package } from 'lucide-react';

// const UpgradeModal = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState('choose'); // choose | dealer | service | carpart
//   const [form, setForm] = useState({});

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       let endpoint = '';

//       if (step === 'dealer') endpoint = '/auth/upgrade-to-dealer';
//       else if (step === 'service') endpoint = '/auth/upgrade-service-provider';
//       else if (step === 'carpart') endpoint = '/auth/upgrade-carpart-seller';

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
//         toast.success(`You're now a ${step === 'dealer' ? 'Dealer' : step === 'service' ? 'Service Provider' : 'Car Part Seller'}!`);
//         onClose();
//         setTimeout(() => window.location.reload(), 1500);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       console.log(err)
//       toast.error('Upgrade failed');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//           <h2 className="text-2xl font-bold">Upgrade Account</h2>
//           <button onClick={onClose}><X className="h-6 w-6" /></button>
//         </div>

//         {step === 'choose' && (
//           <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <button
//               onClick={() => setStep('dealer')}
//               className="p-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
//             >
//               <Building2 className="h-20 w-20 text-blue-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold">Become a Dealer</h3>
//               <p className="text-gray-600 mt-3">Sell multiple cars • Get verified badge</p>
//             </button>
//             <button
//               onClick={() => setStep('service')}
//               className="p-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
//             >
//               <Wrench className="h-20 w-20 text-purple-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold">Service Provider</h3>
//               <p className="text-gray-600 mt-3">Mechanic • Panel Beater • Rewire</p>
//             </button>
//             <button
//               onClick={() => setStep('carpart')}
//               className="p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-gray-800 rounded-2xl hover:scale-105 transition transform"
//             >
//               <Package className="h-20 w-20 text-green-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold">Car Part Seller</h3>
//               <p className="text-gray-600 mt-3">Sell new & used parts • Verified badge</p>
//             </button>
//           </div>
//         )}

//         {step === 'dealer' && (
//           <div className="p-8 space-y-6">
//             <h3 className="text-xl font-bold">Dealer Registration</h3>
//             <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
//             <input placeholder="CAC/Registration Number" onChange={(e) => setForm({...form, businessRegistrationNumber: e.target.value})} className="input" />
//             <input placeholder="Business Address" onChange={(e) => setForm({...form, businessAddress: e.target.value})} className="input" />
//             <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
//             <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
//             <input placeholder="Phone Number" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
//             <button onClick={handleSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
//               Submit for Approval
//             </button>
//           </div>
//         )}

//         {step === 'service' && (
//           <div className="p-8 space-y-6">
//             <h3 className="text-xl font-bold">Service Provider Registration</h3>
//             <select onChange={(e) => setForm({...form, type: e.target.value})} className="input">
//               <option value="">Select Service Type</option>
//               <option value="mechanic">Mechanic</option>
//               <option value="panel_beater">Panel Beater</option>
//               <option value="rewire">Rewire / Auto Electrician</option>
//               <option value="car_wash">Car Wash</option>
//             </select>
//             <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
//             <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
//             <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
//             <input placeholder="Phone/WhatsApp" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
//             <button onClick={handleSubmit} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold">
//               Submit for Approval
//             </button>
//           </div>
//         )}

//         {step === 'carpart' && (
//           <div className="p-8 space-y-6">
//             <h3 className="text-xl font-bold">Car Part Seller Registration</h3>
//             <select onChange={(e) => setForm({...form, type: e.target.value})} className="input">
//               <option value="">Select Parts Type</option>
//               <option value="new-parts">New Parts Only</option>
//               <option value="used-parts">Used Parts Only</option>
//               <option value="both">New & Used Parts</option>
//               <option value="other">Other</option>
//             </select>
//             <input placeholder="Business Name" onChange={(e) => setForm({...form, businessName: e.target.value})} className="input" />
//             <input placeholder="Business Address" onChange={(e) => setForm({...form, businessAddress: e.target.value})} className="input" />
//             <input placeholder="State" onChange={(e) => setForm({...form, state: e.target.value})} className="input" />
//             <input placeholder="LGA" onChange={(e) => setForm({...form, lga: e.target.value})} className="input" />
//             <input placeholder="Phone/WhatsApp" onChange={(e) => setForm({...form, phoneNumber: e.target.value})} className="input" />
//             <input placeholder="Website (optional)" onChange={(e) => setForm({...form, website: e.target.value})} className="input" />
//             <input placeholder="Years of Experience" type="number" onChange={(e) => setForm({...form, yearsOfExperience: e.target.value})} className="input" />
//             <button onClick={handleSubmit} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold">
//               Submit for Approval
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpgradeModal;



import { useState } from 'react';
import { toast } from 'sonner';
import { X, Building2, Wrench, CheckCircle2, Package } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choose');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // to show errors only after user interacts

  // ── Validation Rules ─────────────────────────────────────────────
  const validateField = (name, value) => {
    if (!value && value !== 0) return 'This field is required';

    switch (name) {
      case 'phoneNumber':
        if (!/^\+?\d{9,15}$/.test(value)) {
          return 'Enter a valid phone number (9-15 digits)';
        }
        break;

      case 'yearsOfExperience':
        if (value < 0 || value > 100) {
          return 'Experience must be between 0 and 100 years';
        }
        break;

      case 'businessRegistrationNumber':
        if (value.length < 5) {
          return 'Registration number is too short';
        }
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === 'dealer') {
      ['businessName', 'businessRegistrationNumber', 'businessAddress', 'state', 'lga', 'phoneNumber'].forEach(field => {
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      });
    }

    if (step === 'service') {
      ['type', 'businessName', 'state', 'lga', 'phoneNumber'].forEach(field => {
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      });
    }

    if (step === 'carpart') {
      ['type', 'businessName', 'businessAddress', 'state', 'lga', 'phoneNumber'].forEach(field => {
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      });
      if (form.yearsOfExperience !== undefined) {
        const expError = validateField('yearsOfExperience', form.yearsOfExperience);
        if (expError) newErrors.yearsOfExperience = expError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Validate on change only if field was already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    if (step === 'choose') return true;

    // Required fields per step
    if (step === 'dealer') {
      return !!(
        form.businessName?.trim() &&
        form.businessRegistrationNumber?.trim() &&
        form.businessAddress?.trim() &&
        form.state?.trim() &&
        form.lga?.trim() &&
        form.phoneNumber?.trim()
      );
    }

    if (step === 'service') {
      return !!(
        form.type &&
        form.businessName?.trim() &&
        form.state?.trim() &&
        form.lga?.trim() &&
        form.phoneNumber?.trim()
      );
    }

    if (step === 'carpart') {
      return !!(
        form.type &&
        form.businessName?.trim() &&
        form.businessAddress?.trim() &&
        form.state?.trim() &&
        form.lga?.trim() &&
        form.phoneNumber?.trim()
      );
    }

    return false;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      // Mark all fields as touched to show errors
      const allFields = {};
      Object.keys(form).forEach(key => (allFields[key] = true));
      setTouched(allFields);
      return;
    }

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
        toast.error(data.message || 'Upgrade failed');
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  const inputClass = (fieldName) => `
    w-full p-3 rounded-lg border transition-colors
    ${errors[fieldName] && touched[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
  `;

  const Input = ({ name, placeholder, type = "text", ...props }) => (
    <div>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        value={form[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClass(name)}
        {...props}
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

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
            <Input name="businessName" placeholder="Business Name" />
            <Input name="businessRegistrationNumber" placeholder="CAC/Registration Number" />
            <Input name="businessAddress" placeholder="Business Address" />
            <Input name="state" placeholder="State" />
            <Input name="lga" placeholder="LGA" />
            <Input name="phoneNumber" placeholder="Phone Number" />
            
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-xl font-bold text-white transition
                ${isFormValid() 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit for Approval
            </button>
          </div>
        )}

        {step === 'service' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold">Service Provider Registration</h3>
            
            <div>
              <select
                name="type"
                value={form.type || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('type')}
              >
                <option value="">Select Service Type</option>
                <option value="mechanic">Mechanic</option>
                <option value="panel_beater">Panel Beater</option>
                <option value="rewire">Rewire / Auto Electrician</option>
                <option value="car_wash">Car Wash</option>
              </select>
              {errors.type && touched.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <Input name="businessName" placeholder="Business Name" />
            <Input name="state" placeholder="State" />
            <Input name="lga" placeholder="LGA" />
            <Input name="phoneNumber" placeholder="Phone/WhatsApp" />
            
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-xl font-bold text-white transition
                ${isFormValid() 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit for Approval
            </button>
          </div>
        )}

        {step === 'carpart' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-bold">Car Part Seller Registration</h3>
            
            <div>
              <select
                name="type"
                value={form.type || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass('type')}
              >
                <option value="">Select Parts Type</option>
                <option value="new-parts">New Parts Only</option>
                <option value="used-parts">Used Parts Only</option>
                <option value="both">New & Used Parts</option>
                <option value="other">Other</option>
              </select>
              {errors.type && touched.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <Input name="businessName" placeholder="Business Name" />
            <Input name="businessAddress" placeholder="Business Address" />
            <Input name="state" placeholder="State" />
            <Input name="lga" placeholder="LGA" />
            <Input name="phoneNumber" placeholder="Phone/WhatsApp" />
            <Input name="website" placeholder="Website (optional)" />
            <Input 
              name="yearsOfExperience" 
              placeholder="Years of Experience" 
              type="number" 
              min="0" 
              max="100" 
            />
            
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-xl font-bold text-white transition
                ${isFormValid() 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit for Approval
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;