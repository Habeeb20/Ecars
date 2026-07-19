// /* eslint-disable no-unused-vars */
// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { toast } from 'sonner';
// import { Loader2, Save, Eye, EyeOff } from 'lucide-react';

// const ProfileSettings = () => {
//   const { user, refetch } = useAuth(); // refetch to update sidebar instantly
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     state: '',
//     lga: '',
//     address: '',
//     bio: '',
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   // Populate form when user loads
//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         email: user.email || '',
//         phoneNumber: user.phoneNumber || '',
//         state: user.state || '',
//         lga: user.lga || '',
//         address: user.address || '',
//         bio: user.bio || '',
//       });
//     }
//   }, [user]);

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({ ...prev, [name]: value }));
//   };

//   // Update Profile
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/users/update-me`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(profileData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success('Profile updated successfully!');
//         refetch(); // Update sidebar & context
//       } else {
//         toast.error(data.message || 'Update failed');
//       }
//     } catch (err) {
//       toast.error('Network error. Try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Change Password
//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       toast.error('New password must be at least 6 characters');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/users/update-password`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           currentPassword: passwordData.current,
//           newPassword: passwordData.newPassword,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success('Password changed successfully!');
//         setPasswordData({ current: '', newPassword: '', confirmPassword: '' });
//       } else {
//         toast.error(data.message || 'Wrong current password');
//       }
//     } catch (err) {
//       toast.error('Failed to change password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 lg:p-8">
//       <div className="mb-10 text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           Profile Settings
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account details and preferences</p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Left: Avatar & Stats */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-blue-800 rounded-2xl shadow-xl p-8 text-center">
//             <div className="relative inline-block">
//               <img
//                 src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=fff&bold=true&size=128`}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500 shadow-lg"
//               />
//               <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800"></div>
//             </div>
//             <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
//               {user?.firstName} {user?.lastName}
//             </h2>
//             <p className="text-indigo-600 font-medium">{user?.role?.toUpperCase()}</p>
//             <p className="text-sm text-gray-500 mt-2">Member ID: #{user?.uniqueNumber}</p>
//           </div>
//         </div>

//         {/* Right: Forms */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Update Profile Form */}
//           <div className="bg-white dark:bg-blue-800 rounded-2xl shadow-xl p-8">
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
//             <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6">
//               <InputField label="First Name" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
//               <InputField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
//               <InputField label="Email Address" type="email" name="email" value={profileData.email} onChange={handleProfileChange} disabled />
//               <InputField label="Phone Number" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} placeholder="+234 812 345 6789" />
//               <InputField label="State"State name="state" value={profileData.state} onChange={handleProfileChange} placeholder="e.g Lagos" />
//               <InputField label="LGA" name="lga" value={profileData.lga} onChange={handleProfileChange} placeholder="e.g Ikeja" />
              
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
//                 <textarea
//                   name="address"
//                   rows="3"
//                   value={profileData.address}
//                   onChange={handleProfileChange}
//                   placeholder="123 Freedom Way, Lekki Phase 1..."
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio (Optional)</label>
//                 <textarea
//                   name="bio"
//                   rows="3"
//                   value={profileData.bio}
//                   onChange={handleProfileChange}
//                   placeholder="Tell us about yourself..."
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>

//               <div className="md:col-span-2 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 flex items-center gap-3"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="animate-spin h-5 w-5" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-5 w-5" />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Change Password */}
//           <div className="bg-white dark:bg-blue-800 rounded-2xl shadow-xl p-8">
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>
//             <form onSubmit={handleChangePassword} className="space-y-5">
//               <PasswordInput
//                 label="Current Password"
//                 name="current"
//                 value={passwordData.current}
//                 onChange={handlePasswordChange}
//                 show={showCurrent}
//                 toggleShow={() => setShowCurrent(!showCurrent)}
//               />
//               <PasswordInput
//                 label="New Password"
//                 name="newPassword"
//                 value={passwordData.newPassword}
//                 onChange={handlePasswordChange}
//                 show={showNew}
//                 toggleShow={() => setShowNew(!showNew)}
//               />
//               <PasswordInput
//                 label="Confirm New Password"
//                 name="confirmPassword"
//                 value={passwordData.confirmPassword}
//                 onChange={handlePasswordChange}
//                 show={showConfirm}
//                 toggleShow={() => setShowConfirm(!showConfirm)}
//               />

//               <div className="flex justify-end pt-4">
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-60 flex items-center gap-3"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="animate-spin h-5 w-5" />
//                       Updating...
//                     </>
//                   ) : (
//                     'Change Password'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Input Component
// const InputField = ({ label, type = 'text', ...props }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       {label}
//     </label>
//     <input
//       type={type}
//       className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//       {...props}
//     />
//   </div>
// );

// // Reusable Password Input with Eye Toggle
// const PasswordInput = ({ label, show, toggleShow, ...props }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//       {label}
//     </label>
//     <div className="relative">
//       <input
//         type={show ? 'text' : 'password'}
//         className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-blue-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//         {...props}
//       />
//       <button
//         type="button"
//         onClick={toggleShow}
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//       >
//         {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//       </button>
//     </div>
//   </div>
// );

// export default ProfileSettings;





/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Save, Eye, EyeOff, User, Mail, Phone, MapPin, FileText, Shield, Camera } from 'lucide-react';
import { statesAndLgas } from '../../utils/stateAndLga';

const navy = '#0B1B3E';
const rust = '#C2532A';

const NIGERIAN_STATES = Object.keys(statesAndLgas);

const COUNTRY_CODES = [
  { code: '+234', label: '🇳🇬 +234', country: 'Nigeria' },
  { code: '+1', label: '🇺🇸 +1', country: 'United States' },
  { code: '+44', label: '🇬🇧 +44', country: 'United Kingdom' },
  { code: '+233', label: '🇬🇭 +233', country: 'Ghana' },
  { code: '+254', label: '🇰🇪 +254', country: 'Kenya' },
  { code: '+27', label: '🇿🇦 +27', country: 'South Africa' },
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
];

// Splits a stored phone number like "+2348123456789" into { code: '+234', number: '8123456789' }
function splitPhone(fullNumber) {
  if (!fullNumber) return { code: '+234', number: '' };
  const match = COUNTRY_CODES.find((c) => fullNumber.startsWith(c.code));
  if (match) return { code: match.code, number: fullNumber.slice(match.code.length).trim() };
  return { code: '+234', number: fullNumber.replace(/^\+/, '') };
}

const ProfileSettings = () => {
  const { user, refetch } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '', lastName: '', email: '',
    phoneCode: '+234', phoneNumber: '',
    state: '', lga: '', address: '', bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const lgaOptions = profileData.state && statesAndLgas[profileData.state] ? statesAndLgas[profileData.state] : [];

  useEffect(() => {
    if (user) {
      const { code, number } = splitPhone(user.phoneNumber);
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneCode: code,
        phoneNumber: number,
        state: user.state || '',
        lga: user.lga || '',
        address: user.address || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'state') next.lga = ''; // reset LGA when state changes
      return next;
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileData.state || !profileData.lga) {
      toast.error('Select your state and LGA');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber ? `${profileData.phoneCode}${profileData.phoneNumber}` : '',
        state: profileData.state,
        lga: profileData.lga,
        address: profileData.address,
        bio: profileData.bio,
      };

      const res = await fetch(`${backendUrl}/users/update-me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        refetch();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error('Enter your current password');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await fetch(`${backendUrl}/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Wrong current password');
      }
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
          Profile settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          Manage your account details and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left: Avatar & Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-blue-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 text-center lg:sticky lg:top-6">
            <div className="relative inline-block">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0B1B3E&color=fff&bold=true&size=128`}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto object-cover shadow-lg"
                style={{ border: `4px solid ${navy}` }}
              />
              <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-4 border-white dark:border-gray-800" />
              <button
                type="button"
                className="absolute -bottom-1 -left-1 p-2 rounded-full text-white shadow-md hover:opacity-90 transition"
                style={{ background: rust }}
                title="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-5 text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
              style={{ background: `${navy}15`, color: navy }}
            >
              {user?.role?.toUpperCase()}
            </span>
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5" />
              Member ID: #{user?.uniqueNumber}
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-blue-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <User className="h-5 w-5" style={{ color: rust }} />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Personal information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField label="First name" icon={User} name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                <InputField label="Last name" icon={User} name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
              </div>

              <InputField label="Email address" icon={Mail} type="email" name="email" value={profileData.email} onChange={handleProfileChange} disabled />

              {/* Phone with country code */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  <Phone className="h-3.5 w-3.5" /> Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    name="phoneCode"
                    value={profileData.phoneCode}
                    onChange={handleProfileChange}
                    className="w-28 sm:w-32 h-12 px-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="812 345 6789"
                    className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all"
                  />
                </div>
              </div>

              {/* State + LGA dropdowns */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-3.5 w-3.5" /> State
                  </label>
                  <select
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all"
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-3.5 w-3.5" /> LGA
                  </label>
                  <select
                    name="lga"
                    value={profileData.lga}
                    onChange={handleProfileChange}
                    disabled={!profileData.state}
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{profileData.state ? 'Select LGA' : 'Select state first'}</option>
                    {lgaOptions.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  <MapPin className="h-3.5 w-3.5" /> Full address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  placeholder="123 Freedom Way, Lekki Phase 1..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  <FileText className="h-3.5 w-3.5" /> Bio (optional)
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2.5"
                  style={{ background: `linear-gradient(135deg, ${navy}, #16255C)` }}
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin h-4 w-4" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save changes</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-blue-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <Shield className="h-5 w-5" style={{ color: rust }} />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Change password</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <PasswordInput
                label="Current password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                show={showCurrent}
                toggleShow={() => setShowCurrent(!showCurrent)}
              />
              <PasswordInput
                label="New password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                show={showNew}
                toggleShow={() => setShowNew(!showNew)}
              />
              <PasswordInput
                label="Confirm new password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                show={showConfirm}
                toggleShow={() => setShowConfirm(!showConfirm)}
              />

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="w-full sm:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2.5"
                  style={{ background: rust }}
                >
                  {isPasswordLoading ? (
                    <><Loader2 className="animate-spin h-4 w-4" /> Updating...</>
                  ) : (
                    'Change password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, type = 'text', ...props }) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </label>
    <input
      type={type}
      className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    />
  </div>
);

const PasswordInput = ({ label, show, toggleShow, ...props }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-blue-700 text-gray-900 dark:text-white text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all"
        {...props}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export default ProfileSettings;