



// // pages/Register.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import {
//   User, Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff,
//   Briefcase, Wrench, Package, ShoppingBag, CheckCircle2,
//   Building2, MapPin, Phone, Loader2,
// } from 'lucide-react';

// const NIGERIAN_STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
//   'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
//   'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
//   'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
//   'Yobe','Zamfara',
// ];

// const SERVICE_PROVIDER_TYPES = [
//   { value: 'mechanic',         label: 'Mechanic' },
//   { value: 'panel_beater',     label: 'Panel Beater' },
//   { value: 'rewire',           label: 'Rewire Specialist' },
//   { value: 'auto_electrician', label: 'Auto Electrician' },
//   { value: 'vulcanizer',       label: 'Vulcanizer' },
//   { value: 'car_wash',         label: 'Car Wash' },
//   { value: 'detailer',         label: 'Detailer' },
//   { value: 'upholsterer',      label: 'Upholsterer' },
//   { value: 'ac_specialist',    label: 'AC Specialist' },
//   { value: 'other',            label: 'Other' },
// ];

// const CAR_PART_TYPES = [
//   { value: 'new-parts',  label: 'New Parts' },
//   { value: 'used-parts', label: 'Used Parts (Tokunbo)' },
//   { value: 'both',       label: 'Both New and Used' },
//   { value: 'all',        label: 'All Categories' },
//   { value: 'other',      label: 'Other' },
// ];

// const ROLES = [
//   {
//     value: 'user',
//     label: 'Buyer',
//     desc: 'Browse and buy cars, parts, and services',
//     icon: User,
//   },
//   {
//     value: 'dealer',
//     label: 'Car Dealer',
//     desc: 'List and sell vehicles from your dealership',
//     icon: Briefcase,
//   },
//   {
//     value: 'service-provider',
//     label: 'Service Provider',
//     desc: 'Offer mechanic and auto repair services',
//     icon: Wrench,
//   },
//   {
//     value: 'carPart-seller',
//     label: 'Car Parts Seller',
//     desc: 'Sell new or used auto parts',
//     icon: Package,
//   },
// ];

// const inputCls =
//   'w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm';

// const plainInputCls =
//   'w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm';

// const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';

// const Register = () => {
//   const navigate = useNavigate();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [step, setStep] = useState(1); // 1 = role, 2 = role-specific info, 3 = account details
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [role, setRole] = useState('');

//   // Core account fields
//   const [account, setAccount] = useState({
//     firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
//     phoneNumber: '', state: '', lga: '', address: '',
//   });

//   // Role-specific fields
//   const [dealerInfo, setDealerInfo] = useState({
//     businessName: '', businessRegistrationNumber: '', businessAddress: '', state: '', lga: '',
//   });

//   const [serviceProviderInfo, setServiceProviderInfo] = useState({
//     type: '', businessName: '', businessAddress: '', state: '', lga: '',
//     phoneNumber: '', whatsappNumber: '', yearsOfExperience: '', servicesOffered: '',
//   });

//   const [carPartSellerInfo, setCarPartSellerInfo] = useState({
//     type: '', businessName: '', businessAddress: '', state: '', lga: '',
//     phoneNumber: '', whatsappNumber: '', website: '', yearsOfExperience: '', specialties: '',
//   });

//   const setAcc = (k, v) => setAccount((p) => ({ ...p, [k]: v }));
//   const setDealer = (k, v) => setDealerInfo((p) => ({ ...p, [k]: v }));
//   const setProvider = (k, v) => setServiceProviderInfo((p) => ({ ...p, [k]: v }));
//   const setPartSeller = (k, v) => setCarPartSellerInfo((p) => ({ ...p, [k]: v }));

//   const needsRoleStep = role && role !== 'user';
//   const totalSteps = needsRoleStep ? 3 : 2;

//   // ── Step validation ──────────────────────────────────────────────────────
//   const validateRoleSelection = () => {
//     if (!role) {
//       toast.error('Select a role to continue');
//       return false;
//     }
//     return true;
//   };

//   const validateRoleInfo = () => {
//     if (role === 'dealer') {
//       if (!dealerInfo.businessName || !dealerInfo.businessRegistrationNumber || !dealerInfo.businessAddress || !dealerInfo.state || !dealerInfo.lga) {
//         toast.error('Please fill in all required dealership details');
//         return false;
//       }
//     }
//     if (role === 'service-provider') {
//       if (!serviceProviderInfo.type || !serviceProviderInfo.businessName || !serviceProviderInfo.state || !serviceProviderInfo.lga) {
//         toast.error('Please fill in all required service provider details');
//         return false;
//       }
//     }
//     if (role === 'carPart-seller') {
//       if (!carPartSellerInfo.type || !carPartSellerInfo.businessName || !carPartSellerInfo.businessAddress || !carPartSellerInfo.state || !carPartSellerInfo.lga) {
//         toast.error('Please fill in all required parts seller details');
//         return false;
//       }
//     }
//     return true;
//   };

//   const validateAccount = () => {
//     if (!account.firstName || !account.lastName) {
//       toast.error('Enter both first and last name');
//       return false;
//     }
//     if (!account.email) {
//       toast.error('Enter your email address');
//       return false;
//     }
//     if (account.password.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return false;
//     }
//     if (account.password !== account.confirmPassword) {
//       toast.error('Passwords do not match');
//       return false;
//     }
//     return true;
//   };

//   // ── Navigation ────────────────────────────────────────────────────────────
//   const goNext = () => {
//     if (step === 1) {
//       if (!validateRoleSelection()) return;
//       setStep(needsRoleStep ? 2 : 3);
//       return;
//     }
//     if (step === 2) {
//       if (!validateRoleInfo()) return;
//       setStep(3);
//     }
//   };

//   const goBack = () => {
//     if (step === 3 && needsRoleStep) return setStep(2);
//     setStep(1);
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateAccount()) return;

//     setIsLoading(true);
//     try {
//       const payload = {
//         firstName: account.firstName.trim(),
//         lastName: account.lastName.trim(),
//         email: account.email.toLowerCase().trim(),
//         password: account.password,
//         role,
//         phoneNumber: account.phoneNumber,
//         state: account.state,
//         lga: account.lga,
//         address: account.address,
//       };

//       if (role === 'dealer') payload.dealerInfo = dealerInfo;
//       if (role === 'service-provider') {
//         payload.serviceProviderInfo = {
//           ...serviceProviderInfo,
//           yearsOfExperience: serviceProviderInfo.yearsOfExperience ? Number(serviceProviderInfo.yearsOfExperience) : undefined,
//           servicesOffered: serviceProviderInfo.servicesOffered
//             ? serviceProviderInfo.servicesOffered.split(',').map((s) => s.trim()).filter(Boolean)
//             : [],
//         };
//       }
//       if (role === 'carPart-seller') {
//         payload.carPartSellerInfo = {
//           ...carPartSellerInfo,
//           yearsOfExperience: carPartSellerInfo.yearsOfExperience ? Number(carPartSellerInfo.yearsOfExperience) : undefined,
//           specialties: carPartSellerInfo.specialties
//             ? carPartSellerInfo.specialties.split(',').map((s) => s.trim()).filter(Boolean)
//             : [],
//         };
//       }

//       const res = await fetch(`${backendUrl}/users/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok && data.status !== 'fail') {
//         localStorage.setItem('token', data.token);
//         toast.success('Account created. Welcome to ECARS');
//         setTimeout(() => navigate('/dashboard'), 800);
//       } else {
//         toast.error(data.message || 'Registration failed');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Network error. Check your connection and try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ── Step indicator ───────────────────────────────────────────────────────
//   const StepDots = () => (
//     <div className="flex items-center justify-center gap-2 mb-6">
//       {Array.from({ length: totalSteps }).map((_, i) => {
//         const stepNum = i === 0 ? 1 : i === 1 && needsRoleStep ? 2 : 3;
//         const isActive = step === stepNum;
//         const isDone = step > stepNum;
//         return (
//           <div
//             key={i}
//             className={`h-1.5 rounded-full transition-all duration-300 ${
//               isActive ? 'w-8 bg-indigo-600' : isDone ? 'w-4 bg-indigo-300' : 'w-4 bg-gray-200 dark:bg-gray-600'
//             }`}
//           />
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 my-12">
//       <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">

//         {/* Header */}
//         <div className="text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Create your account
//           </h2>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
//               Sign in
//             </Link>
//           </p>
//         </div>

//         <StepDots />

//         {/* ═══════════════ STEP 1 — Role selection ═══════════════ */}
//         {step === 1 && (
//           <div className="space-y-4">
//             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//               How will you use ECARS?
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {ROLES.map((r) => {
//                 const Icon = r.icon;
//                 const active = role === r.value;
//                 return (
//                   <button
//                     key={r.value}
//                     type="button"
//                     onClick={() => setRole(r.value)}
//                     className={`relative text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
//                       active
//                         ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
//                         : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700'
//                     }`}
//                   >
//                     {active && (
//                       <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-indigo-600" />
//                     )}
//                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
//                       active ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'
//                     }`}>
//                       <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`} />
//                     </div>
//                     <p className="text-sm font-bold text-gray-900 dark:text-white">{r.label}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{r.desc}</p>
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               type="button"
//               onClick={goNext}
//               className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
//             >
//               Continue
//               <ArrowRight size={16} />
//             </button>
//           </div>
//         )}

//         {/* ═══════════════ STEP 2 — Role-specific info ═══════════════ */}
//         {step === 2 && role === 'dealer' && (
//           <div className="space-y-4">
//             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//               Dealership details
//             </p>

//             <div>
//               <label className={labelCls}>Business name *</label>
//               <div className="relative">
//                 <Building2 className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input className={inputCls} placeholder="e.g. Habeeb Auto Dealers" value={dealerInfo.businessName} onChange={(e) => setDealer('businessName', e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className={labelCls}>Business registration number *</label>
//               <input className={plainInputCls} placeholder="RC1234567" value={dealerInfo.businessRegistrationNumber} onChange={(e) => setDealer('businessRegistrationNumber', e.target.value)} />
//             </div>

//             <div>
//               <label className={labelCls}>Business address *</label>
//               <div className="relative">
//                 <MapPin className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input className={inputCls} placeholder="Street, area" value={dealerInfo.businessAddress} onChange={(e) => setDealer('businessAddress', e.target.value)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>State *</label>
//                 <select className={plainInputCls} value={dealerInfo.state} onChange={(e) => setDealer('state', e.target.value)}>
//                   <option value="">Select state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>LGA *</label>
//                 <input className={plainInputCls} placeholder="Local govt. area" value={dealerInfo.lga} onChange={(e) => setDealer('lga', e.target.value)} />
//               </div>
//             </div>

//             <StepNavButtons onBack={goBack} onNext={goNext} />
//           </div>
//         )}

//         {step === 2 && role === 'service-provider' && (
//           <div className="space-y-4">
//             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//               Service provider details
//             </p>

//             <div>
//               <label className={labelCls}>Service type *</label>
//               <select className={plainInputCls} value={serviceProviderInfo.type} onChange={(e) => setProvider('type', e.target.value)}>
//                 <option value="">Select service type</option>
//                 {SERVICE_PROVIDER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//             </div>

//             <div>
//               <label className={labelCls}>Business name *</label>
//               <div className="relative">
//                 <Wrench className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input className={inputCls} placeholder="e.g. Femi's Auto Repairs" value={serviceProviderInfo.businessName} onChange={(e) => setProvider('businessName', e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className={labelCls}>Business address</label>
//               <input className={plainInputCls} placeholder="Workshop / shop address" value={serviceProviderInfo.businessAddress} onChange={(e) => setProvider('businessAddress', e.target.value)} />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>State *</label>
//                 <select className={plainInputCls} value={serviceProviderInfo.state} onChange={(e) => setProvider('state', e.target.value)}>
//                   <option value="">Select state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>LGA *</label>
//                 <input className={plainInputCls} placeholder="Local govt. area" value={serviceProviderInfo.lga} onChange={(e) => setProvider('lga', e.target.value)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>Phone number</label>
//                 <div className="relative">
//                   <Phone className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                   <input className={inputCls} placeholder="+2348..." value={serviceProviderInfo.phoneNumber} onChange={(e) => setProvider('phoneNumber', e.target.value)} />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelCls}>WhatsApp number</label>
//                 <input className={plainInputCls} placeholder="+2348..." value={serviceProviderInfo.whatsappNumber} onChange={(e) => setProvider('whatsappNumber', e.target.value)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>Years of experience</label>
//                 <input type="number" min="0" className={plainInputCls} placeholder="e.g. 5" value={serviceProviderInfo.yearsOfExperience} onChange={(e) => setProvider('yearsOfExperience', e.target.value)} />
//               </div>
//               <div>
//                 <label className={labelCls}>Services offered</label>
//                 <input className={plainInputCls} placeholder="comma separated" value={serviceProviderInfo.servicesOffered} onChange={(e) => setProvider('servicesOffered', e.target.value)} />
//               </div>
//             </div>

//             <StepNavButtons onBack={goBack} onNext={goNext} />
//           </div>
//         )}

//         {step === 2 && role === 'carPart-seller' && (
//           <div className="space-y-4">
//             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//               Parts seller details
//             </p>

//             <div>
//               <label className={labelCls}>Parts type *</label>
//               <select className={plainInputCls} value={carPartSellerInfo.type} onChange={(e) => setPartSeller('type', e.target.value)}>
//                 <option value="">Select parts type</option>
//                 {CAR_PART_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//             </div>

//             <div>
//               <label className={labelCls}>Business name *</label>
//               <div className="relative">
//                 <ShoppingBag className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input className={inputCls} placeholder="e.g. Sunday Auto Parts" value={carPartSellerInfo.businessName} onChange={(e) => setPartSeller('businessName', e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className={labelCls}>Business address *</label>
//               <input className={plainInputCls} placeholder="Shop / market address" value={carPartSellerInfo.businessAddress} onChange={(e) => setPartSeller('businessAddress', e.target.value)} />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>State *</label>
//                 <select className={plainInputCls} value={carPartSellerInfo.state} onChange={(e) => setPartSeller('state', e.target.value)}>
//                   <option value="">Select state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>LGA *</label>
//                 <input className={plainInputCls} placeholder="Local govt. area" value={carPartSellerInfo.lga} onChange={(e) => setPartSeller('lga', e.target.value)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>Phone number</label>
//                 <input className={plainInputCls} placeholder="+2348..." value={carPartSellerInfo.phoneNumber} onChange={(e) => setPartSeller('phoneNumber', e.target.value)} />
//               </div>
//               <div>
//                 <label className={labelCls}>WhatsApp number</label>
//                 <input className={plainInputCls} placeholder="+2348..." value={carPartSellerInfo.whatsappNumber} onChange={(e) => setPartSeller('whatsappNumber', e.target.value)} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelCls}>Years of experience</label>
//                 <input type="number" min="0" className={plainInputCls} placeholder="e.g. 5" value={carPartSellerInfo.yearsOfExperience} onChange={(e) => setPartSeller('yearsOfExperience', e.target.value)} />
//               </div>
//               <div>
//                 <label className={labelCls}>Website</label>
//                 <input className={plainInputCls} placeholder="optional" value={carPartSellerInfo.website} onChange={(e) => setPartSeller('website', e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className={labelCls}>Specialties</label>
//               <input className={plainInputCls} placeholder="comma separated, e.g. engine, suspension" value={carPartSellerInfo.specialties} onChange={(e) => setPartSeller('specialties', e.target.value)} />
//             </div>

//             <StepNavButtons onBack={goBack} onNext={goNext} />
//           </div>
//         )}

//         {/* ═══════════════ STEP 3 — Account details ═══════════════ */}
//         {step === 3 && (
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//               Your account
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="relative">
//                 <User className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input required placeholder="First name" className={inputCls} value={account.firstName} onChange={(e) => setAcc('firstName', e.target.value)} disabled={isLoading} />
//               </div>
//               <div className="relative">
//                 <User className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//                 <input required placeholder="Last name" className={inputCls} value={account.lastName} onChange={(e) => setAcc('lastName', e.target.value)} disabled={isLoading} />
//               </div>
//             </div>

//             <div className="relative">
//               <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//               <input required type="email" placeholder="Email address" className={inputCls} value={account.email} onChange={(e) => setAcc('email', e.target.value)} disabled={isLoading} />
//             </div>

//             <div className="relative">
//               <Phone className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//               <input placeholder="Phone number" className={inputCls} value={account.phoneNumber} onChange={(e) => setAcc('phoneNumber', e.target.value)} disabled={isLoading} />
//             </div>

//             {/* Only ask for personal state/lga/address if buyer (no business address already given) */}
//             {role === 'user' && (
//               <div className="grid grid-cols-2 gap-3">
//                 <select className={plainInputCls} value={account.state} onChange={(e) => setAcc('state', e.target.value)} disabled={isLoading}>
//                   <option value="">Select state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//                 <input placeholder="LGA" className={plainInputCls} value={account.lga} onChange={(e) => setAcc('lga', e.target.value)} disabled={isLoading} />
//               </div>
//             )}

//             <div className="relative">
//               <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//               <input
//                 required
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Password"
//                 className={`${inputCls} pr-12`}
//                 value={account.password}
//                 onChange={(e) => setAcc('password', e.target.value)}
//                 disabled={isLoading}
//               />
//               <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>

//             <div className="relative">
//               <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
//               <input
//                 required
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 placeholder="Confirm password"
//                 className={`${inputCls} pr-12`}
//                 value={account.confirmPassword}
//                 onChange={(e) => setAcc('confirmPassword', e.target.value)}
//                 disabled={isLoading}
//               />
//               <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
//                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>

//             <div className="flex gap-3 pt-1">
//               <button
//                 type="button"
//                 onClick={goBack}
//                 disabled={isLoading}
//                 className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
//               >
//                 <ArrowLeft size={15} />
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-60"
//               >
//                 {isLoading && <Loader2 size={16} className="animate-spin" />}
//                 {isLoading ? 'Creating account…' : 'Create account'}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Back to home */}
//         <div className="text-center pt-1">
//           <Link to="/" className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
//             <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
//             Back to home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── shared next/back buttons for step 2 ─────────────────────────────────────
// const StepNavButtons = ({ onBack, onNext }) => (
//   <div className="flex gap-3 pt-1">
//     <button
//       type="button"
//       onClick={onBack}
//       className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
//     >
//       <ArrowLeft size={15} />
//       Back
//     </button>
//     <button
//       type="button"
//       onClick={onNext}
//       className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
//     >
//       Continue
//       <ArrowRight size={16} />
//     </button>
//   </div>
// );

// export default Register;



// pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  User, Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff,
  Briefcase, Wrench, Package, ShoppingBag, CheckCircle2,
  Building2, MapPin, Phone, Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { statesAndLgas } from '../../utils/stateAndLga';

const NIGERIAN_STATES = Object.keys(statesAndLgas);

const SERVICE_PROVIDER_TYPES = [
  { value: 'mechanic',         label: 'Mechanic' },
  { value: 'panel_beater',     label: 'Panel Beater' },
  { value: 'rewire',           label: 'Rewire Specialist' },
  { value: 'auto_electrician', label: 'Auto Electrician' },
  { value: 'vulcanizer',       label: 'Vulcanizer' },
  { value: 'car_wash',         label: 'Car Wash' },
  { value: 'detailer',         label: 'Detailer' },
  { value: 'upholsterer',      label: 'Upholsterer' },
  { value: 'ac_specialist',    label: 'AC Specialist' },
  { value: 'other',            label: 'Other' },
];

const CAR_PART_TYPES = [
  { value: 'new-parts',  label: 'New Parts' },
  { value: 'used-parts', label: 'Used Parts (Tokunbo)' },
  { value: 'both',       label: 'Both New and Used' },
  { value: 'all',        label: 'All Categories' },
  { value: 'other',      label: 'Other' },
];

const ROLES = [
  { value: 'user', label: 'Buyer', desc: 'Browse and buy cars, parts, and services', icon: User },
  { value: 'dealer', label: 'Car Dealer', desc: 'List and sell vehicles from your dealership', icon: Briefcase },
  { value: 'service-provider', label: 'Service Provider', desc: 'Offer mechanic and auto repair services', icon: Wrench },
  { value: 'carPart-seller', label: 'Car Parts Seller', desc: 'Sell new or used auto parts', icon: Package },
];

const inputCls =
  'w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm';

const plainInputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed';

const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';

/* ---------------------------------------------------------------------- */
/*  Reusable State + LGA pair. LGA is a dropdown driven by statesAndLgas,  */
/*  disabled until a state is picked, and resets whenever state changes.  */
/* ---------------------------------------------------------------------- */
function StateLgaFields({ state, lga, onStateChange, onLgaChange, disabled = false }) {
  const lgaOptions = state && statesAndLgas[state] ? statesAndLgas[state] : [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    onStateChange(newState);
    onLgaChange(''); // reset LGA since it belongs to the previous state
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelCls}>State *</label>
        <select
          className={plainInputCls}
          value={state}
          onChange={handleStateChange}
          disabled={disabled}
        >
          <option value="">Select state</option>
          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>LGA *</label>
        <select
          className={plainInputCls}
          value={lga}
          onChange={(e) => onLgaChange(e.target.value)}
          disabled={disabled || !state}
        >
          <option value="">{state ? 'Select LGA' : 'Select state first'}</option>
          {lgaOptions.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}

const Register = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState('');

  const [account, setAccount] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', state: '', lga: '', address: '',
  });

  const [dealerInfo, setDealerInfo] = useState({
    businessName: '', businessRegistrationNumber: '', businessAddress: '', state: '', lga: '',
  });

  const [serviceProviderInfo, setServiceProviderInfo] = useState({
    type: '', businessName: '', businessAddress: '', state: '', lga: '',
    phoneNumber: '', whatsappNumber: '', yearsOfExperience: '', servicesOffered: '',
  });

  const [carPartSellerInfo, setCarPartSellerInfo] = useState({
    type: '', businessName: '', businessAddress: '', state: '', lga: '',
    phoneNumber: '', whatsappNumber: '', website: '', yearsOfExperience: '', specialties: '',
  });

  const setAcc = (k, v) => setAccount((p) => ({ ...p, [k]: v }));
  const setDealer = (k, v) => setDealerInfo((p) => ({ ...p, [k]: v }));
  const setProvider = (k, v) => setServiceProviderInfo((p) => ({ ...p, [k]: v }));
  const setPartSeller = (k, v) => setCarPartSellerInfo((p) => ({ ...p, [k]: v }));

  const needsRoleStep = role && role !== 'user';
  const totalSteps = needsRoleStep ? 3 : 2;

  const validateRoleSelection = () => {
    if (!role) {
      toast.error('Select a role to continue');
      return false;
    }
    return true;
  };

  const validateRoleInfo = () => {
    if (role === 'dealer') {
      if (!dealerInfo.businessName || !dealerInfo.businessRegistrationNumber || !dealerInfo.businessAddress || !dealerInfo.state || !dealerInfo.lga) {
        toast.error('Please fill in all required dealership details');
        return false;
      }
    }
    if (role === 'service-provider') {
      if (!serviceProviderInfo.type || !serviceProviderInfo.businessName || !serviceProviderInfo.state || !serviceProviderInfo.lga) {
        toast.error('Please fill in all required service provider details');
        return false;
      }
    }
    if (role === 'carPart-seller') {
      if (!carPartSellerInfo.type || !carPartSellerInfo.businessName || !carPartSellerInfo.businessAddress || !carPartSellerInfo.state || !carPartSellerInfo.lga) {
        toast.error('Please fill in all required parts seller details');
        return false;
      }
    }
    return true;
  };

  const validateAccount = () => {
    if (!account.firstName || !account.lastName) {
      toast.error('Enter both first and last name');
      return false;
    }
    if (!account.email) {
      toast.error('Enter your email address');
      return false;
    }
    if (role === 'user' && (!account.state || !account.lga)) {
      toast.error('Select your state and LGA');
      return false;
    }
    if (account.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (account.password !== account.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1) {
      if (!validateRoleSelection()) return;
      setStep(needsRoleStep ? 2 : 3);
      return;
    }
    if (step === 2) {
      if (!validateRoleInfo()) return;
      setStep(3);
    }
  };

  const goBack = () => {
    if (step === 3 && needsRoleStep) return setStep(2);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccount()) return;

    setIsLoading(true);
    try {
      const payload = {
        firstName: account.firstName.trim(),
        lastName: account.lastName.trim(),
        email: account.email.toLowerCase().trim(),
        password: account.password,
        role,
        phoneNumber: account.phoneNumber,
        state: account.state,
        lga: account.lga,
        address: account.address,
      };

      if (role === 'dealer') payload.dealerInfo = dealerInfo;
      if (role === 'service-provider') {
        payload.serviceProviderInfo = {
          ...serviceProviderInfo,
          yearsOfExperience: serviceProviderInfo.yearsOfExperience ? Number(serviceProviderInfo.yearsOfExperience) : undefined,
          servicesOffered: serviceProviderInfo.servicesOffered
            ? serviceProviderInfo.servicesOffered.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        };
      }
      if (role === 'carPart-seller') {
        payload.carPartSellerInfo = {
          ...carPartSellerInfo,
          yearsOfExperience: carPartSellerInfo.yearsOfExperience ? Number(carPartSellerInfo.yearsOfExperience) : undefined,
          specialties: carPartSellerInfo.specialties
            ? carPartSellerInfo.specialties.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        };
      }

      const res = await fetch(`${backendUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status !== 'fail') {
        await login(data.token);
        toast.success('Account created. Welcome to ECARS');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StepDots = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i === 0 ? 1 : i === 1 && needsRoleStep ? 2 : 3;
        const isActive = step === stepNum;
        const isDone = step > stepNum;
        return (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isActive ? 'w-8 bg-indigo-600' : isDone ? 'w-4 bg-indigo-300' : 'w-4 bg-gray-200 dark:bg-gray-600'
            }`}
          />
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 my-12">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <StepDots />

        {/* ═══════════════ STEP 1 — Role selection ═══════════════ */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              How will you use ECARS?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`relative text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700'
                    }`}
                  >
                    {active && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-indigo-600" />
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                      active ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{r.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{r.desc}</p>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ═══════════════ STEP 2 — Role-specific info ═══════════════ */}
        {step === 2 && role === 'dealer' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Dealership details
            </p>

            <div>
              <label className={labelCls}>Business name *</label>
              <div className="relative">
                <Building2 className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input className={inputCls} placeholder="e.g. Habeeb Auto Dealers" value={dealerInfo.businessName} onChange={(e) => setDealer('businessName', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Business registration number *</label>
              <input className={plainInputCls} placeholder="RC1234567" value={dealerInfo.businessRegistrationNumber} onChange={(e) => setDealer('businessRegistrationNumber', e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Business address *</label>
              <div className="relative">
                <MapPin className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input className={inputCls} placeholder="Street, area" value={dealerInfo.businessAddress} onChange={(e) => setDealer('businessAddress', e.target.value)} />
              </div>
            </div>

            <StateLgaFields
              state={dealerInfo.state}
              lga={dealerInfo.lga}
              onStateChange={(v) => setDealer('state', v)}
              onLgaChange={(v) => setDealer('lga', v)}
            />

            <StepNavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {step === 2 && role === 'service-provider' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Service provider details
            </p>

            <div>
              <label className={labelCls}>Service type *</label>
              <select className={plainInputCls} value={serviceProviderInfo.type} onChange={(e) => setProvider('type', e.target.value)}>
                <option value="">Select service type</option>
                {SERVICE_PROVIDER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Business name *</label>
              <div className="relative">
                <Wrench className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input className={inputCls} placeholder="e.g. Femi's Auto Repairs" value={serviceProviderInfo.businessName} onChange={(e) => setProvider('businessName', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Business address</label>
              <input className={plainInputCls} placeholder="Workshop / shop address" value={serviceProviderInfo.businessAddress} onChange={(e) => setProvider('businessAddress', e.target.value)} />
            </div>

            <StateLgaFields
              state={serviceProviderInfo.state}
              lga={serviceProviderInfo.lga}
              onStateChange={(v) => setProvider('state', v)}
              onLgaChange={(v) => setProvider('lga', v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone number</label>
                <div className="relative">
                  <Phone className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                  <input className={inputCls} placeholder="+2348..." value={serviceProviderInfo.phoneNumber} onChange={(e) => setProvider('phoneNumber', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>WhatsApp number</label>
                <input className={plainInputCls} placeholder="+2348..." value={serviceProviderInfo.whatsappNumber} onChange={(e) => setProvider('whatsappNumber', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Years of experience</label>
                <input type="number" min="0" className={plainInputCls} placeholder="e.g. 5" value={serviceProviderInfo.yearsOfExperience} onChange={(e) => setProvider('yearsOfExperience', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Services offered</label>
                <input className={plainInputCls} placeholder="comma separated" value={serviceProviderInfo.servicesOffered} onChange={(e) => setProvider('servicesOffered', e.target.value)} />
              </div>
            </div>

            <StepNavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {step === 2 && role === 'carPart-seller' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Parts seller details
            </p>

            <div>
              <label className={labelCls}>Parts type *</label>
              <select className={plainInputCls} value={carPartSellerInfo.type} onChange={(e) => setPartSeller('type', e.target.value)}>
                <option value="">Select parts type</option>
                {CAR_PART_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Business name *</label>
              <div className="relative">
                <ShoppingBag className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input className={inputCls} placeholder="e.g. Sunday Auto Parts" value={carPartSellerInfo.businessName} onChange={(e) => setPartSeller('businessName', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Business address *</label>
              <input className={plainInputCls} placeholder="Shop / market address" value={carPartSellerInfo.businessAddress} onChange={(e) => setPartSeller('businessAddress', e.target.value)} />
            </div>

            <StateLgaFields
              state={carPartSellerInfo.state}
              lga={carPartSellerInfo.lga}
              onStateChange={(v) => setPartSeller('state', v)}
              onLgaChange={(v) => setPartSeller('lga', v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone number</label>
                <input className={plainInputCls} placeholder="+2348..." value={carPartSellerInfo.phoneNumber} onChange={(e) => setPartSeller('phoneNumber', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>WhatsApp number</label>
                <input className={plainInputCls} placeholder="+2348..." value={carPartSellerInfo.whatsappNumber} onChange={(e) => setPartSeller('whatsappNumber', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Years of experience</label>
                <input type="number" min="0" className={plainInputCls} placeholder="e.g. 5" value={carPartSellerInfo.yearsOfExperience} onChange={(e) => setPartSeller('yearsOfExperience', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input className={plainInputCls} placeholder="optional" value={carPartSellerInfo.website} onChange={(e) => setPartSeller('website', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Specialties</label>
              <input className={plainInputCls} placeholder="comma separated, e.g. engine, suspension" value={carPartSellerInfo.specialties} onChange={(e) => setPartSeller('specialties', e.target.value)} />
            </div>

            <StepNavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {/* ═══════════════ STEP 3 — Account details ═══════════════ */}
        {step === 3 && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your account
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input required placeholder="First name" className={inputCls} value={account.firstName} onChange={(e) => setAcc('firstName', e.target.value)} disabled={isLoading} />
              </div>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                <input required placeholder="Last name" className={inputCls} value={account.lastName} onChange={(e) => setAcc('lastName', e.target.value)} disabled={isLoading} />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <input required type="email" placeholder="Email address" className={inputCls} value={account.email} onChange={(e) => setAcc('email', e.target.value)} disabled={isLoading} />
            </div>

            <div className="relative">
              <Phone className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <input placeholder="Phone number" className={inputCls} value={account.phoneNumber} onChange={(e) => setAcc('phoneNumber', e.target.value)} disabled={isLoading} />
            </div>

            {/* Only ask for personal state/lga if buyer (no business address already given) */}
            {role === 'user' && (
              <StateLgaFields
                state={account.state}
                lga={account.lga}
                onStateChange={(v) => setAcc('state', v)}
                onLgaChange={(v) => setAcc('lga', v)}
                disabled={isLoading}
              />
            )}

            <div className="relative">
              <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`${inputCls} pr-12`}
                value={account.password}
                onChange={(e) => setAcc('password', e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className={`${inputCls} pr-12`}
                value={account.confirmPassword}
                onChange={(e) => setAcc('confirmPassword', e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <ArrowLeft size={15} />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-60"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-1">
          <Link to="/" className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

const StepNavButtons = ({ onBack, onNext }) => (
  <div className="flex gap-3 pt-1">
    <button
      type="button"
      onClick={onBack}
      className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
    >
      <ArrowLeft size={15} />
      Back
    </button>
    <button
      type="button"
      onClick={onNext}
      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
    >
      Continue
      <ArrowRight size={16} />
    </button>
  </div>
);

export default Register;