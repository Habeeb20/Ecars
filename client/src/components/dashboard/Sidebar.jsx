




// /* eslint-disable no-unused-vars */
// // src/components/dashboard/Sidebar.jsx
// import { useState } from 'react';
// import { 
//   Car, Settings, MessageSquare, Upload, User, Grid,
//   LogOut, X, ShieldAlert, Users, FileText, BarChart, Bell, ListChecks,
//   Mail,
//   SubscriptIcon,
//   Package,
//   MessageCircle,
//   LucideSettings2,
//   DollarSign,
//   Image,
//   LucideGamepadDirectional
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
// import MyCarPartListings from './MyCarPartListing';
// import MyMessages from './MyMessage';
// import BrowseListings from './BrowseLisitng';
// import CompareCars from './CompareAllCars';
// import DealerOffers from './DealerOffer';
// import GalleryFeed from './Gallery';
// import PostDealForm from './PostDeal';
// import MyReceivedOffers from './MyRecievedOffer';
// import InventoryDashboard from '../../pages/dealer/InventoryDashboard';
// import SalesAnalyticsDashboard from '../../pages/dealer/SalesAnalytics';
// const Sidebar = ({ onClose, setCurrentView }) => {
//   const { user, logout } = useAuth();
//   const [activeView, setActiveView] = useState('overview');
//   const isAdmin = user?.role === 'admin';

//   console.log(user)

//   // Map views to components
//   const views = {
//     overview: <Overview />,
//     uploadCars: <UploadCars />,
//     uploadCarParts: <UploadCarPart />,
//     browseCarListing: < BrowseListings/>,
//     listings: <MyListings />,
//     deals: <PostDealForm />,
//     carPartListings: <MyCarPartListings />,
//     verifyEmail: <SomePage />,
//     subscription: <SubscriptionPlans />,
//     myplans: <MySubscriptions />,
//     sales: <SalesAnalyticsDashboard />,
//     profile: <ProfileSettings />,
//     message: <MyMessages/>,
//    compareCars: <CompareCars/>,
//   dealeroffers: <DealerOffers/>,
//   gallery: <GalleryFeed />,
//   recievedOffer: <MyReceivedOffers />,
//   Inventory:<InventoryDashboard /> 

  
//   };

//   const handleClick = (viewKey) => {
//     setActiveView(viewKey);
//     setCurrentView(views[viewKey]);
//     onClose?.();
//   };

//   const baseMenuItems = [
//     { icon: Grid, label: 'Dashboard', view: 'overview' },
//     { icon: Upload, view: 'uploadCars' },       // Dynamic label + view
//     { icon: ListChecks, view: 'listings' },     // Dynamic label + view
//     { icon: LucideSettings2, label: 'Manage Listings', view: 'browseCarListing' },
//     { icon: LucideSettings2, label: 'Inventory ', view: 'Inventory' },
//     { icon: LucideSettings2, label: 'sales analytics ', view: 'sales' },
//     // { icon: Mail, label: 'Verify Your Email', view: 'verifyEmail' },
   
//     { icon: Car, label: 'compare cars', view: 'compareCars' },
//     { icon: DollarSign, label: 'Offers', view: 'dealeroffers' },
//     { icon: LucideGamepadDirectional, label: 'Deals', view: 'deals' },
//     { icon: Package, label: 'My Plans', view: 'myplans' },
//     { icon: SubscriptIcon, label: 'Subscribe To Plans', view: 'subscription' },
//     { icon: User, label: 'Profile', view: 'profile' },
//     { icon: MessageCircle, label: 'Messages', view: 'message' },
//     { icon: MessageCircle, label: 'My recieved offers', view: 'recievedOffer' },
//      { icon: Image, label: 'Gallery', view: 'gallery' },,
 
//   ];

//   const adminMenuItems = [
//     { icon: Users, label: 'User Management', view: 'adminUsers' },
//     { icon: ShieldAlert, label: 'Reports & Flags', view: 'adminReports' },
//     { icon: FileText, label: 'Content Management', view: 'adminContent' },
//     { icon: BarChart, label: 'Analytics', view: 'adminAnalytics' },
//   ];

//   // Dynamic label + view for upload and listings
//   const getMenuItem = (item) => {
//     if (item.view === 'uploadCars') {
//       if (user?.role === 'dealer') {
//         return { ...item, label: 'Upload Cars for Sale', view: 'uploadCars' };
//         return { ...item, label: 'inventory', view: 'inventory' };
//         return { ...item, label: 'sales analytics', view: 'sales' };
//       }
//       if (user?.role === 'carPart-seller') {
//         return { ...item, label: 'Upload Car Parts for Sale', view: 'uploadCarParts' };
        
//       }
//       return null; // Hide for others
//     }

//     if (item.view === 'listings') {
//       if (user?.role === 'dealer') {
//         return { ...item, label: 'My Car Listings', view: 'listings' };
//       }
//       if (user?.role === 'carPart-seller') {
//         return { ...item, label: 'My Car Part Listings', view: 'carPartListings' };
//       }
//       return null; // Hide for others
//     }

//     return item; // Other items remain unchanged
//   };

//   return (
//     <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//       <div className="flex flex-col h-full">
//         {/* Mobile Close Button */}
//         <div className="md:hidden p-4 flex justify-end">
//           <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
//             <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//           </button>
//         </div>

//         {/* User Info */}
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
//             {baseMenuItems.map((item) => {
//               const menuItem = getMenuItem(item);
//               if (!menuItem) return null;

//               const Icon = menuItem.icon;
//               const isActive = activeView === menuItem.view;

//               return (
//                 <button
//                   key={menuItem.view}
//                   onClick={() => handleClick(menuItem.view)}
//                   className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
//                       : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
//                   }`}
//                 >
//                   <Icon className="h-5 w-5 mr-3" />
//                   {menuItem.label}
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



// src/components/dashboard/Sidebar.jsx
import { useState } from 'react';
import {
  Car, MessageSquare, Upload, User, Grid,
  LogOut, X, ShieldAlert, Users, FileText, BarChart, ListChecks,
  Package, MessageCircle, Settings2, DollarSign, Image, Gamepad2,
  Wrench, ClipboardList, Star, Briefcase,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UploadCars from './UploadCars';
import MyListings from './Listings';
import Overview from './Overview';
import ProfileSettings from './ProfileSettings';
import { SomePage } from './VerifyEmailPage';
import SubscriptionPlans from './SubscriptionPlans';
import MySubscriptions from './MySubscription';
import UploadCarPart from './UploadCarPart';
import MyCarPartListings from './MyCarPartListing';
import MyMessages from './MyMessage';
import BrowseListings from './BrowseLisitng';
import CompareCars from './CompareAllCars';
import DealerOffers from './DealerOffer';
import GalleryFeed from './Gallery';
import PostDealForm from './PostDeal';
import MyReceivedOffers from './MyRecievedOffer';
import InventoryDashboard from '../../pages/dealer/InventoryDashboard';
import SalesAnalyticsDashboard from '../../pages/dealer/SalesAnalytics';

// ─── view registry — every renderable panel, keyed by view id ───────────────
const VIEWS = {
  overview:          <Overview />,
  uploadCars:        <UploadCars />,
  uploadCarParts:    <UploadCarPart />,
  browseCarListing:  <BrowseListings />,
  listings:          <MyListings />,
  carPartListings:   <MyCarPartListings />,
  deals:             <PostDealForm />,
  verifyEmail:       <SomePage />,
  subscription:      <SubscriptionPlans />,
  myplans:           <MySubscriptions />,
  sales:             <SalesAnalyticsDashboard />,
  Inventory:         <InventoryDashboard />,
  profile:           <ProfileSettings />,
  message:           <MyMessages />,
  compareCars:       <CompareCars />,
  dealeroffers:      <DealerOffers />,
  gallery:           <GalleryFeed />,
  recievedOffer:     <MyReceivedOffers />,
};

// ─── per-role menu configs ────────────────────────────────────────────────────
// Every role shares a few common items (profile, messages, gallery), then gets
// items specific to what that role actually needs.

const COMMON_ITEMS = [
  { icon: Grid,           label: 'Dashboard', view: 'overview' },
];

const COMMON_FOOTER_ITEMS = [
  { icon: Package,        label: 'My plans',          view: 'myplans' },
  { icon: DollarSign,     label: 'Subscribe to plans', view: 'subscription' },
  { icon: User,           label: 'Profile',           view: 'profile' },
  { icon: MessageCircle,  label: 'Messages',          view: 'message' },
  { icon: Image,          label: 'Gallery',           view: 'gallery' },
];

const ROLE_MENUS = {
  // ── Car dealer ──────────────────────────────────────────────────────────
  dealer: [
    ...COMMON_ITEMS,
    { icon: Upload,       label: 'Upload cars for sale', view: 'uploadCars' },
    { icon: ListChecks,   label: 'My car listings',      view: 'listings' },
    { icon: Settings2,    label: 'Manage listings',      view: 'browseCarListing' },
    { icon: Package,      label: 'Inventory',            view: 'Inventory' },
    { icon: BarChart,     label: 'Sales analytics',      view: 'sales' },
    { icon: Car,          label: 'Compare cars',         view: 'compareCars' },
    { icon: DollarSign,   label: 'Offers',                view: 'dealeroffers' },
    { icon: Gamepad2,     label: 'Deals',                 view: 'deals' },
    { icon: MessageCircle,label: 'My received offers',    view: 'recievedOffer' },
    ...COMMON_FOOTER_ITEMS,
  ],

  // ── Service provider (mechanic, panel beater, etc.) ────────────────────
  'service-provider': [
    ...COMMON_ITEMS,
    { icon: Wrench,       label: 'My services',          view: 'listings' },
    { icon: ClipboardList,label: 'Service requests',     view: 'recievedOffer' },
    { icon: Star,         label: 'Reviews & ratings',    view: 'profile' },
    { icon: MessageCircle,label: 'Messages',             view: 'message' },
    ...COMMON_FOOTER_ITEMS.filter((i) => i.view !== 'message'),
  ],

  // ── Car parts seller ─────────────────────────────────────────────────────
  'carPart-seller': [
    ...COMMON_ITEMS,
    { icon: Upload,       label: 'Upload car parts for sale', view: 'uploadCarParts' },
    { icon: ListChecks,   label: 'My car part listings',      view: 'carPartListings' },
    { icon: DollarSign,   label: 'Offers',                     view: 'dealeroffers' },
    { icon: MessageCircle,label: 'My received offers',         view: 'recievedOffer' },
    ...COMMON_FOOTER_ITEMS,
  ],

  // ── Regular buyer / user ─────────────────────────────────────────────────
  user: [
    ...COMMON_ITEMS,
    { icon: Car,          label: 'Browse cars',         view: 'browseCarListing' },
    { icon: Briefcase,    label: 'Compare cars',        view: 'compareCars' },
    { icon: Gamepad2,     label: 'Deals',               view: 'deals' },
    ...COMMON_FOOTER_ITEMS,
  ],
};

const ADMIN_MENU_ITEMS = [
  { icon: Users,       label: 'User management',     view: 'adminUsers' },
  { icon: ShieldAlert, label: 'Reports & flags',      view: 'adminReports' },
  { icon: FileText,    label: 'Content management',   view: 'adminContent' },
  { icon: BarChart,    label: 'Analytics',            view: 'adminAnalytics' },
];

const Sidebar = ({ onClose, setCurrentView }) => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');

  const isAdmin = user?.role === 'superadmin';
  const menuItems = ROLE_MENUS[user?.role] || ROLE_MENUS.user;

  const handleClick = (viewKey) => {
    setActiveView(viewKey);
    setCurrentView(VIEWS[viewKey]);
    onClose?.();
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">

        {/* Mobile close button */}
        <div className="md:hidden p-4 flex justify-end">
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.firstName || '') + ' ' + (user?.lastName || 'User'))}&background=6366f1&color=fff&bold=true`}
              alt="User"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500"
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                {(user?.role || 'user').replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
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
                  <Icon className="h-5 w-5 mr-3 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {/* Admin section */}
            {isAdmin && (
              <>
                <div className="pt-6 pb-2">
                  <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin panel
                  </p>
                </div>
                {ADMIN_MENU_ITEMS.map((item) => {
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
                      <Icon className="h-5 w-5 mr-3 shrink-0" />
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
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;