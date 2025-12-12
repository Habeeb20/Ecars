


// // components/dashboard/Sidebar.jsx  ← Your same file, only small upgrade

// import { useState } from 'react';
// import { 
//   Car, Settings, MessageSquare, Upload, User, Grid,
//   LogOut, X, ShieldAlert, Users, FileText, BarChart, Bell, ListChecks,
//   Mail,
//   SubscriptIcon,
//   SquircleDashedIcon
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';
// import UploadCars from './UploadCars';
// import MyListings from './Listings';
// import Overview from './Overview';
// import ProfileSettings from './ProfileSettings';
// import VerifyEmailModal from './VerifyEmailModal';
// import { SomePage } from './VerifyEmailPage';
// import SubscriptionPlans from './SubscriptionPlans';
// import MySubscriptions from './MySubscription';
// import UploadCarPart from './UploadCarPart';
// // Import your dashboard pages directly

// // import ManageCars from '../../pages/dashboard/ManageCars';
// // import Messages from '../../pages/dashboard/Messages';
// // import Notifications from '../../pages/dashboard/Notifications';
// // import Profile from '../../pages/dashboard/Profile';
// // import SettingsPage from '../../pages/dashboard/Settings';
// // import AdminUsers from '../../pages/dashboard/admin/Users';
// // import AdminReports from '../../pages/dashboard/admin/Reports';
// // import AdminContent from '../../pages/dashboard/admin/Content';
// // import AdminAnalytics from '../../pages/dashboard/admin/Analytics';

// const Sidebar = ({ onClose, setCurrentView }) => {
//   const { user, logout } = useAuth();
//   const [activeView, setActiveView] = useState('overview');
//   const isAdmin = user?.role === 'admin';

//   // Map views to components
//   const views = {
//     overview: <Overview />,
//     upload: <UploadCars />,
//     uploadCarParts: <UploadCarPart />,
//     listings: <MyListings />,
//     verifyEmail: <SomePage />,
//   subscription: <SubscriptionPlans/>,
//     // notifications: <Notifications />,
//     profile: <ProfileSettings />,
//     // settings: <SettingsPage />,
//     myplans: <MySubscriptions />,
//     // adminReports: <AdminReports />,
//     // adminContent: <AdminContent />,
//     // adminAnalytics: <AdminAnalytics />,
//   };

//   const handleClick = (viewKey) => {
//     setActiveView(viewKey);
//     setCurrentView(views[viewKey]); // Send to parent
//     onClose?.(); // Close mobile menu
//   };

//   const menuItems = [
//     { icon: Grid, label: 'Dashboard', view: 'overview' },
//     { icon: Upload, label: 'Upload Cars for sales', view: 'upload' },
//     { icon: ListChecks, label: 'Listings', view: 'listings' },
//     { icon: Mail, label: 'Verify Your Email', view: 'verifyEmail' },
//     { icon: Car, label: 'Manage Cars', view: 'manageCars' },
//     { icon: MessageSquare, label: 'Messages', view: 'messages' },
//     { icon: Bell, label: 'Notifications', view: 'notifications' },
//     { icon: SquircleDashedIcon, label: 'My Plans', view: 'myplans' },
//       { icon: SubscriptIcon, label: 'Subscribe To Plans', view: 'subscription' },
//     { icon: User, label: 'Profile', view: 'profile' },
  
//   ];


//    const getLabel = (view) => {
//     if (view !== 'upload') return 'upload carParts';

//     if (user?.role === 'dealer') return 'Upload Cars for Sale';
//     if (user?.role === 'carPart-seller') return 'Upload Car Parts for Sale';
//     return null; // hide for service-provider or others
//   };

//   const adminMenuItems = [
//     { icon: Users, label: 'User Management', view: 'adminUsers' },
//     { icon: ShieldAlert, label: 'Reports & Flags', view: 'adminReports' },
//     { icon: FileText, label: 'Content Management', view: 'adminContent' },
//     { icon: BarChart, label: 'Analytics', view: 'adminAnalytics' },
//   ];

//   return (
//     <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//       <div className="flex flex-col h-full">
//         {/* Mobile Close Button */}
//         <div className="md:hidden p-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//           </button>
//         </div>

//         {/* User Info - NOW SHOWS REAL DATA */}
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center space-x-3">
//             <img
//               src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName || 'User')}&background=6366f1&color=fff&bold=true`}
//               alt="User"
//               className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500"
//             />
//             <div>
//               <p className="font-semibold text-gray-900 dark:text-white">
//                 {user?.firstName} {user?.lastName}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 {user?.email}
//               </p>
//               <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
//                 {user?.role?.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex-1 overflow-y-auto py-4">
//           <nav className="space-y-1 px-3">
//             {menuItems.map((item) => {
//                  const label = getLabel(item.view);
//         if (!label) return null;

//               const Icon = item.icon;
//               const isActive = activeView === item.view;

//               return (
//                 <button
//                   key={item.view}
//                   onClick={() => handleClick(item.view)}
//                   className={`w-full flex items-center px-4 py-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
//                       : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
//                   }`}
//                 >
//                   <Icon className="h-5 w-5 mr-3" />
//                   {item.label}
//                 </button>
//               );
//             })}

//             {/* Admin Section */}
//             {isAdmin && (
//               <>
//                 <div className="pt-6 pb-2">
//                   <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Admin Panel
//                   </p>
//                 </div>
//                 {adminMenuItems.map((item) => {
//                   const Icon = item.icon;
//                   const isActive = activeView === item.view;

//                   return (
//                     <button
//                       key={item.view}
//                       onClick={() => handleClick(item.view)}
//                       className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
//                         isActive
//                           ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 shadow-sm'
//                           : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
//                       }`}
//                     >
//                       <Icon className="h-5 w-5 mr-3" />
//                       {item.label}
//                     </button>
//                   );
//                 })}
//               </>
//             )}
//           </nav>
//         </div>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//           <button
//             onClick={logout}
//             className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
//           >
//             <LogOut className="h-5 w-5 mr-3" />
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;













/* eslint-disable no-unused-vars */
// src/components/dashboard/Sidebar.jsx
import { useState } from 'react';
import { 
  Car, Settings, MessageSquare, Upload, User, Grid,
  LogOut, X, ShieldAlert, Users, FileText, BarChart, Bell, ListChecks,
  Mail,
  SubscriptIcon,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UploadCars from './UploadCars';
import MyListings from './Listings';
import Overview from './Overview';
import ProfileSettings from './ProfileSettings';
import VerifyEmailModal from './VerifyEmailModal';
import { SomePage } from './VerifyEmailPage';
import SubscriptionPlans from './SubscriptionPlans';
import MySubscriptions from './MySubscription';
import UploadCarPart from './UploadCarPart';
// Import your dashboard pages directly

const Sidebar = ({ onClose, setCurrentView }) => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const isAdmin = user?.role === 'admin';

  // Map views to components
  const views = {
    overview: <Overview />,
    upload: <UploadCars />,
    uploadCarParts: <UploadCarPart />,
    listings: <MyListings />,
    verifyEmail: <SomePage />,
    subscription: <SubscriptionPlans />,
    myplans: <MySubscriptions />,
    // notifications: <Notifications />,
    profile: <ProfileSettings />,
    // settings: <SettingsPage />,
    // adminReports: <AdminReports />,
    // adminContent: <AdminContent />,
    // adminAnalytics: <AdminAnalytics />,
  };

  const handleClick = (viewKey) => {
    setActiveView(viewKey);
    setCurrentView(views[viewKey]); // Send to parent
    onClose?.(); // Close mobile menu
  };

  const menuItems = [
    { icon: Grid, label: 'Dashboard', view: 'overview' },
    { icon: Upload, view: 'upload' }, // No label here – we generate it dynamically
    { icon: ListChecks, label: 'Listings', view: 'listings' },
    { icon: Mail, label: 'Verify Your Email', view: 'verifyEmail' },
    { icon: Package, label: 'My Plans', view: 'myplans' },
    { icon: SubscriptIcon, label: 'Subscribe To Plans', view: 'subscription' },
    { icon: User, label: 'Profile', view: 'profile' },
  ];

  // Dynamic label based on user role (only for the upload item)
  const getLabel = (view) => {
    if (view !== 'upload') return null; // Only change label for upload view

    if (user?.role === 'dealer') {
      return 'Upload Cars for Sale';
    }
    if (user?.role === 'carPart-seller') {
      return 'Upload Car Parts for Sale';
    }
    if (user?.role === 'service-provider') {
      return null; // Completely hide for service providers
    }
    return null; // Hide for regular users or others
  };

  const adminMenuItems = [
    { icon: Users, label: 'User Management', view: 'adminUsers' },
    { icon: ShieldAlert, label: 'Reports & Flags', view: 'adminReports' },
    { icon: FileText, label: 'Content Management', view: 'adminContent' },
    { icon: BarChart, label: 'Analytics', view: 'adminAnalytics' },
  ];

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Mobile Close Button */}
        <div className="md:hidden p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName || 'User')}&background=6366f1&color=fff&bold=true`}
              alt="User"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const label = item.label || getLabel(item.view);

              // Hide the item completely if no label (e.g. for service-provider)
              if (!label) return null;

              const Icon = item.icon;
              const isActive = activeView === item.view;

              return (
                <button
                  key={item.view}
                  onClick={() => handleClick(item.view)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </button>
              );
            })}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin Panel
                  </p>
                </div>
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.view;

                  return (
                    <button
                      key={item.view}
                      onClick={() => handleClick(item.view)}
                      className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;



