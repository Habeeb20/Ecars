/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';

const ProfileSettings = () => {
  const { user, refetch } = useAuth(); // refetch to update sidebar instantly
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    state: '',
    lga: '',
    address: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        state: user.state || '',
        lga: user.lga || '',
        address: user.address || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/users/update-me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        refetch(); // Update sidebar & context
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({ current: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Wrong current password');
      }
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account details and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="relative inline-block">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=fff&bold=true&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800"></div>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-indigo-600 font-medium">{user?.role?.toUpperCase()}</p>
            <p className="text-sm text-gray-500 mt-2">Member ID: #{user?.uniqueNumber}</p>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Update Profile Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6">
              <InputField label="First Name" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
              <InputField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
              <InputField label="Email Address" type="email" name="email" value={profileData.email} onChange={handleProfileChange} disabled />
              <InputField label="Phone Number" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} placeholder="+234 812 345 6789" />
              <InputField label="State"State name="state" value={profileData.state} onChange={handleProfileChange} placeholder="e.g Lagos" />
              <InputField label="LGA" name="lga" value={profileData.lga} onChange={handleProfileChange} placeholder="e.g Ikeja" />
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  placeholder="123 Freedom Way, Lekki Phase 1..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio (Optional)</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <PasswordInput
                label="Current Password"
                name="current"
                value={passwordData.current}
                onChange={handlePasswordChange}
                show={showCurrent}
                toggleShow={() => setShowCurrent(!showCurrent)}
              />
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                show={showNew}
                toggleShow={() => setShowNew(!showNew)}
              />
              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                show={showConfirm}
                toggleShow={() => setShowConfirm(!showConfirm)}
              />

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-60 flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Updating...
                    </>
                  ) : (
                    'Change Password'
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

// Reusable Input Component
const InputField = ({ label, type = 'text', ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
      {...props}
    />
  </div>
);

// Reusable Password Input with Eye Toggle
const PasswordInput = ({ label, show, toggleShow, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        {...props}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
);

export default ProfileSettings;