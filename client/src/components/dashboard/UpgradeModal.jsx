

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { X, Building2, Wrench, Package } from 'lucide-react';

// const UpgradeModal = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState('choose');
//   const [form, setForm] = useState({});
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Reset form when modal opens or step changes
//   useEffect(() => {
//     if (isOpen) {
//       setForm({});
//       setErrors({});
//       setTouched({});
//       setLoading(false);
//     }
//   }, [isOpen, step]);

//   const validateField = (name, value) => {
//     const strValue = typeof value === 'string' ? value.trim() : String(value ?? '').trim();

//     if (!strValue && strValue !== '0') {
//       return 'This field is required';
//     }

//     switch (name) {
//       case 'phoneNumber':
//         if (!/^\+?\d{9,15}$/.test(strValue)) {
//           return 'Enter a valid phone number (9–15 digits)';
//         }
//         break;

//       case 'yearsOfExperience':
//         const num = Number(strValue);
//         if (isNaN(num) || num < 0 || num > 100) {
//           return 'Experience must be between 0 and 100 years';
//         }
//         break;

//       case 'businessRegistrationNumber': {
//         const upper = strValue.toUpperCase();

//         if (!upper) return 'Business registration number is required';

//         const commonRegex = /^(RC|BN)\d{7}$/;
//         const trusteeRegex = /^CAC\/IT\/NO\s?\d{6,7}$/i;

//         if (!commonRegex.test(upper) && !trusteeRegex.test(upper)) {
//           return 'Invalid format. Use RC1234567, BN7654321 or CAC/IT/NO 1234567';
//         }

//         if (upper.startsWith('RC') || upper.startsWith('BN')) {
//           if (upper.length !== 9) {
//             return 'RC/BN number must be exactly 9 characters (e.g. RC1234567)';
//           }
//         }

//         if (upper.includes('CAC/IT/NO')) {
//           if (upper.length < 12 || upper.length > 13) {
//             return 'CAC/IT/NO number should be 12–13 characters';
//           }
//         }
//         break;
//       }

//       case 'type':
//         if (!strValue) return 'Please select a type';
//         break;

//       default:
//         break;
//     }

//     return '';
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     let requiredFields = [];

//     if (step === 'dealer') {
//       requiredFields = [
//         'businessName',
//         'businessRegistrationNumber',
//         'businessAddress',
//         'state',
//         'lga',
//         'phoneNumber',
//       ];
//     } else if (step === 'service') {
//       requiredFields = ['type', 'businessName', 'state', 'lga', 'phoneNumber'];
//     } else if (step === 'carpart') {
//       requiredFields = [
//         'type',
//         'businessName',
//         'businessAddress',
//         'state',
//         'lga',
//         'phoneNumber',
//       ];
//       // yearsOfExperience is optional
//     }

//     requiredFields.forEach((field) => {
//       const error = validateField(field, form[field]);
//       if (error) newErrors[field] = error;
//     });

//     // Optional field with validation
//     if (step === 'carpart' && form.yearsOfExperience !== undefined) {
//       const expError = validateField('yearsOfExperience', form.yearsOfExperience);
//       if (expError) newErrors.yearsOfExperience = expError;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));

//     if (touched[name]) {
//       const error = validateField(name, value);
//       setErrors((prev) => ({ ...prev, [name]: error }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     const error = validateField(name, value);
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error('Please correct the errors in the form');
//       const allTouched = {};
//       Object.keys(form).forEach((key) => (allTouched[key] = true));
//       setTouched(allTouched);
//       return;
//     }

//     setLoading(true);

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
//         toast.success(
//           `You're now a ${
//             step === 'dealer' ? 'Dealer' : step === 'service' ? 'Service Provider' : 'Car Part Seller'
//           }!`
//         );
//         onClose();
//         setTimeout(() => window.location.reload(), 1500);
//       } else {
//         toast.error(data.message || 'Upgrade failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getInputClass = (fieldName) =>
//     `w-full p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
//       errors[fieldName] && touched[fieldName]
//         ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
//         : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/30'
//     }`;



// const Input = ({ name, placeholder, type = 'text', ...props }) => {
//   return (
//     <div>
//       <input
//         name={name}
//         placeholder={placeholder}
//         type={type}
//         value={form[name] !== undefined ? String(form[name]) : ''}         
//         onChange={(e) => {
//           console.log('→ typing in', name, 'new value:', e.target.value);
//           setForm((prevForm) => {
//             const newForm = { ...prevForm };
//             newForm[name] = e.target.value;
//             return newForm;
//           });

//           if (touched[name]) {
//             const error = validateField(name, e.target.value);
//             setErrors((prev) => ({ ...prev, [name]: error }));
//           }
//         }}
//         onBlur={handleBlur}
//         className={getInputClass(name)}
//         {...props}
//       />
//       {errors[name] && touched[name] && (
//         <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
//       )}
//     </div>
//   );
// };

//   const Select = ({ name, placeholder, options }) => (
//     <div>
//       <select
//         name={name}
//         value={form[name] ?? ''}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         className={getInputClass(name)}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//       {errors[name] && touched[name] && (
//         <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
//       )}
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
//           <h2 className="text-2xl font-bold">Upgrade Account</h2>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {step === 'choose' && (
//           <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <button
//               onClick={() => setStep('dealer')}
//               className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-blue-200"
//             >
//               <Building2 className="h-16 w-16 md:h-20 md:w-20 text-blue-600 mx-auto mb-4" />
//               <h3 className="text-xl md:text-2xl font-bold">Become a Dealer</h3>
//               <p className="text-gray-600 mt-3 text-sm md:text-base">
//                 Sell multiple cars • Get verified badge
//               </p>
//             </button>

//             <button
//               onClick={() => setStep('service')}
//               className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-purple-200"
//             >
//               <Wrench className="h-16 w-16 md:h-20 md:w-20 text-purple-600 mx-auto mb-4" />
//               <h3 className="text-xl md:text-2xl font-bold">Service Provider</h3>
//               <p className="text-gray-600 mt-3 text-sm md:text-base">
//                 Mechanic • Panel Beater • Rewire • Car Wash
//               </p>
//             </button>

//             <button
//               onClick={() => setStep('carpart')}
//               className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-green-200"
//             >
//               <Package className="h-16 w-16 md:h-20 md:w-20 text-green-600 mx-auto mb-4" />
//               <h3 className="text-xl md:text-2xl font-bold">Car Part Seller</h3>
//               <p className="text-gray-600 mt-3 text-sm md:text-base">
//                 Sell new & used parts • Verified badge
//               </p>
//             </button>
//           </div>
//         )}

//         {step !== 'choose' && (
//           <div className="p-6 md:p-8 space-y-6">
//             <button
//               onClick={() => setStep('choose')}
//               className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
//             >
//               ← Back to options
//             </button>

//             <h3 className="text-xl font-bold">
//               {step === 'dealer'
//                 ? 'Dealer Registration'
//                 : step === 'service'
//                 ? 'Service Provider Registration'
//                 : 'Car Part Seller Registration'}
//             </h3>

//             {step === 'dealer' && (
//               <>
//                 <Input name="businessName" placeholder="Business Name" />
//                 <Input name="businessRegistrationNumber" placeholder="CAC/Registration Number (RC1234567 / BN...)" />
//                 <Input name="businessAddress" placeholder="Business Address" />
//                 <Input name="state" placeholder="State" />
//                 <Input name="lga" placeholder="LGA" />
//                 <Input name="phoneNumber" placeholder="Phone Number" />
//               </>
//             )}

//             {step === 'service' && (
//               <>
//                 <Select
//                   name="type"
//                   placeholder="Select Service Type"
//                   options={[
//                     { value: 'mechanic', label: 'Mechanic' },
//                     { value: 'panel_beater', label: 'Panel Beater' },
//                     { value: 'rewire', label: 'Rewire / Auto Electrician' },
//                     { value: 'car_wash', label: 'Car Wash' },
//                   ]}
//                 />
//                 <Input name="businessName" placeholder="Business Name" />
//                 <Input name="state" placeholder="State" />
//                 <Input name="lga" placeholder="LGA" />
//                 <Input name="phoneNumber" placeholder="Phone / WhatsApp" />
//               </>
//             )}

//             {step === 'carpart' && (
//               <>
//                 <Select
//                   name="type"
//                   placeholder="Select Parts Type"
//                   options={[
//                     { value: 'new-parts', label: 'New Parts Only' },
//                     { value: 'used-parts', label: 'Used Parts Only' },
//                     { value: 'both', label: 'New & Used Parts' },
//                     { value: 'other', label: 'Other' },
//                   ]}
//                 />
//                 <Input name="businessName" placeholder="Business Name" />
//                 <Input name="businessAddress" placeholder="Business Address" />
//                 <Input name="state" placeholder="State" />
//                 <Input name="lga" placeholder="LGA" />
//                 <Input name="phoneNumber" placeholder="Phone / WhatsApp" />
//                 <Input
//                   name="yearsOfExperience"
//                   placeholder="Years of Experience (optional)"
//                   type="number"
//                   min="0"
//                   max="100"
//                 />
//               </>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={loading || Object.keys(errors).length > 0}
//               className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
//                 loading || Object.keys(errors).length > 0
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : step === 'dealer'
//                   ? 'bg-blue-600 hover:bg-blue-700'
//                   : step === 'service'
//                   ? 'bg-purple-600 hover:bg-purple-700'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {loading ? 'Submitting...' : 'Submit for Approval'}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpgradeModal;



import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Building2, Wrench, Package } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choose');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({});
      setErrors({});
      setTouched({});
      setLoading(false);
    }
  }, [isOpen, step]);

  const validateField = (name, value) => {
    const strValue = String(value ?? '').trim();


  if (strValue === '') {
    return 'This field is required';
  }

    switch (name) {
      case 'phoneNumber':
        if (!/^\+?\d{9,15}$/.test(strValue)) {
          return 'Enter a valid phone number (9–15 digits)';
        }
        break;

      case 'yearsOfExperience':
        const num = Number(strValue);
        if (isNaN(num) || num < 0 || num > 100) {
          return 'Experience must be between 0 and 100 years';
        }
        break;

      case 'businessRegistrationNumber': {
        const upper = strValue.toUpperCase();
        if (!upper) return 'Business registration number is required';

        const commonRegex = /^(RC|BN)\d{7}$/;
        const trusteeRegex = /^CAC\/IT\/NO\s?\d{6,7}$/i;

        if (!commonRegex.test(upper) && !trusteeRegex.test(upper)) {
          return 'Invalid format. Use RC1234567, BN7654321 or CAC/IT/NO 1234567';
        }

        if (upper.startsWith('RC') || upper.startsWith('BN')) {
          if (upper.length !== 9) {
            return 'RC/BN number must be exactly 9 characters (e.g. RC1234567)';
          }
        }

        if (upper.includes('CAC/IT/NO')) {
          if (upper.length < 12 || upper.length > 13) {
            return 'CAC/IT/NO number should be 12–13 characters';
          }
        }
        break;
      }

      case 'type':
        if (!strValue) return 'Please select a type';
        break;

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let requiredFields = [];

    if (step === 'dealer') {
      requiredFields = ['businessName', 'businessRegistrationNumber', 'businessAddress', 'state', 'lga', 'phoneNumber'];
    } else if (step === 'service') {
      requiredFields = ['type', 'businessName', 'state', 'lga', 'phoneNumber'];
    } else if (step === 'carpart') {
      requiredFields = ['type', 'businessName', 'businessAddress', 'state', 'lga', 'phoneNumber'];
    }

    requiredFields.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    // Optional field validation
    if (step === 'carpart' && form.yearsOfExperience !== undefined && form.yearsOfExperience !== '') {
      const expError = validateField('yearsOfExperience', form.yearsOfExperience);
      if (expError) newErrors.yearsOfExperience = expError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const getInputClass = (fieldName) =>
    `w-full p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
      errors[fieldName] && touched[fieldName]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/30'
    }`;

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');

      const allTouched = { ...touched };
      // Mark all possible fields
      ['businessName', 'businessRegistrationNumber', 'businessAddress', 'state', 'lga', 'phoneNumber', 'type', 'yearsOfExperience'].forEach(
        (f) => (allTouched[f] = true)
      );
      setTouched(allTouched);
      return;
    }

    setLoading(true);

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
        toast.success(
          `You're now a ${
            step === 'dealer' ? 'Dealer' : step === 'service' ? 'Service Provider' : 'Car Part Seller'
          }!`
        );
        onClose();
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.message || 'Upgrade failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Upgrade Account</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'choose' && (
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setStep('dealer')}
              className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-blue-200"
            >
              <Building2 className="h-16 w-16 md:h-20 md:w-20 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold">Become a Dealer</h3>
              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Sell multiple cars • Get verified badge
              </p>
            </button>

            <button
              onClick={() => setStep('service')}
              className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-purple-200"
            >
              <Wrench className="h-16 w-16 md:h-20 md:w-20 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold">Service Provider</h3>
              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Mechanic • Panel Beater • Rewire • Car Wash
              </p>
            </button>

            <button
              onClick={() => setStep('carpart')}
              className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:scale-105 transition transform duration-200 border border-green-200"
            >
              <Package className="h-16 w-16 md:h-20 md:w-20 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold">Car Part Seller</h3>
              <p className="text-gray-600 mt-3 text-sm md:text-base">
                Sell new & used parts • Verified badge
              </p>
            </button>
          </div>
        )}

        {step !== 'choose' && (
          <div className="p-6 md:p-8 space-y-6">
            {/* <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-sm mb-4">
      <strong>Debug info (remove later):</strong><br />
      Loading: {loading ? 'true' : 'false'}<br />
      Errors count: {Object.keys(errors).length}<br />
      Errors object: <pre>{JSON.stringify(errors, null, 2)}</pre>
      Touched fields: <pre>{JSON.stringify(touched, null, 2)}</pre>
      Current form values: <pre>{JSON.stringify(form, null, 2)}</pre>
    </div> */}
            <button
              onClick={() => setStep('choose')}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
            >
              ← Back to options
            </button>

            <h3 className="text-xl font-bold">
              {step === 'dealer'
                ? 'Dealer Registration'
                : step === 'service'
                ? 'Service Provider Registration'
                : 'Car Part Seller Registration'}
            </h3>

            {/* ────────────────────────────────────────────── */}
            {/* DEALER FORM – each field written out separately */}
            {/* ────────────────────────────────────────────── */}
            {step === 'dealer' && (
              <>
                <div>
                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessName')}
                  />
                  {errors.businessName && touched.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="businessRegistrationNumber"
                    placeholder="CAC/Registration Number (RC1234567 / BN...)"
                    value={form.businessRegistrationNumber ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessRegistrationNumber')}
                  />
                  {errors.businessRegistrationNumber && touched.businessRegistrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessRegistrationNumber}</p>
                  )}
                </div>

                <div>
                  <input
                    name="businessAddress"
                    placeholder="Business Address"
                    value={form.businessAddress ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessAddress')}
                  />
                  {errors.businessAddress && touched.businessAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                  )}
                </div>

                <div>
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('state')}
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <input
                    name="lga"
                    placeholder="LGA"
                    value={form.lga ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('lga')}
                  />
                  {errors.lga && touched.lga && (
                    <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
                  )}
                </div>

                <div>
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('phoneNumber')}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* ────────────────────────────────────────────── */}
            {/* SERVICE PROVIDER FORM */}
            {/* ────────────────────────────────────────────── */}
            {step === 'service' && (
              <>
                <div>
                  <select
                    name="type"
                    value={form.type ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('type')}
                  >
                    <option value="" >Select Service Type</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="panel_beater">Panel Beater</option>
                    <option value="rewire">Rewire / Auto Electrician</option>
                    <option value="car_wash">Car Wash</option>
                  </select>
                  {errors.type && touched.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessName')}
                  />
                  {errors.businessName && touched.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('state')}
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <input
                    name="lga"
                    placeholder="LGA"
                    value={form.lga ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('lga')}
                  />
                  {errors.lga && touched.lga && (
                    <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
                  )}
                </div>

                <div>
                  <input
                    name="phoneNumber"
                    placeholder="Phone / WhatsApp"
                    value={form.phoneNumber ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('phoneNumber')}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* ────────────────────────────────────────────── */}
            {/* CAR PART SELLER FORM */}
            {/* ────────────────────────────────────────────── */}
            {step === 'carpart' && (
              <>
                <div>
                  <select
                    name="type"
                    value={form.type ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('type')}
                  >
                    <option value="" >Select Parts Type</option>
                    <option value="new-parts">New Parts Only</option>
                    <option value="used-parts">Used Parts Only</option>
                    <option value="both">New & Used Parts</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && touched.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessName')}
                  />
                  {errors.businessName && touched.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <input
                    name="businessAddress"
                    placeholder="Business Address"
                    value={form.businessAddress ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('businessAddress')}
                  />
                  {errors.businessAddress && touched.businessAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                  )}
                </div>

                <div>
                  <input
                    name="state"
                    placeholder="State"
                    value={form.state ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('state')}
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <input
                    name="lga"
                    placeholder="LGA"
                    value={form.lga ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('lga')}
                  />
                  {errors.lga && touched.lga && (
                    <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
                  )}
                </div>

                <div>
                  <input
                    name="phoneNumber"
                    placeholder="Phone / WhatsApp"
                    value={form.phoneNumber ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('phoneNumber')}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <input
                    name="yearsOfExperience"
                    placeholder="Years of Experience (optional)"
                    type="number"
                    min="0"
                    max="100"
                    value={form.yearsOfExperience ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('yearsOfExperience')}
                  />
                  {errors.yearsOfExperience && touched.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              // disabled={loading }
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                loading || Object.keys(errors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : step === 'dealer'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : step === 'service'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;