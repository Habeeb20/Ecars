// src/pages/admin/components/Sidebar.jsx
import { Home, Users, Car, Wrench, DollarSign, Settings, LogOut, SettingsIcon, MessagesSquare } from 'lucide-react';
import Overview from './Overview';
import AllUsers from './AllUsers';
import DealersList from './DealersList';
import SuperadminSubscriptions from './superAdminSubscription';
import BlogManagement from '../blog/BlogManagement';
import AdminValuedCars from './ValueAsset';
import AdminBlacklist from './BlacklistUsers';
import ServiceProviderList from './ServiceProviders';
import CarPartSellerList from './CarpartSellerList';
import AdminMessages from './AdminAccessMessage';
import ReportsPage from './AllReports';
import AdminContacts from './ContactDetails';
import AdminSightings from './AdminReportSighting';
// import UsersList from './UsersList';
// import DealersList from './DealersList';
// import ServiceProvidersList from './ServiceProvidersList';
// import Payments from './Payments';
// import SettingsPage from './SettingsPage';

const Sidebar = ({ onClose, setCurrentView }) => {
  const menuItems = [
    { name: 'Overview', icon: Home, component: <Overview /> },
    { name: 'All Users', icon: Users, component: <AllUsers /> },
    { name: 'Dealers', icon: Car, component: <DealersList /> },
    { name: 'All Reports', icon: Car, component: <ReportsPage /> },
    { name: 'Contacts', icon: Car, component: <AdminContacts /> },
    { name: 'Blog', icon: Car, component: <BlogManagement /> },
      { name: 'stolen Cars Reports', icon: MessagesSquare, component: <AdminSightings /> },
    { name: 'ValuedAssets', icon: Car, component: <AdminValuedCars /> },
    { name: 'car parts sellers', icon: Car, component: <CarPartSellerList /> },
    { name: 'Service Providers', icon: Wrench, component: <ServiceProviderList /> },
    { name: 'subscription', icon: DollarSign, component: <SuperadminSubscriptions /> },
    { name: 'Blacklist', icon: SettingsIcon, component: <AdminBlacklist /> },
    { name: 'View Messages', icon: MessagesSquare, component: <AdminMessages /> },
  
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-1xl font-bold text-blue-600 dark:text-blue-400"> Admin</h3>
        <p className="text-sm text-gray-500">Superadmin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setCurrentView(item.component);
              onClose?.();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-xl text-left hover:bg-red-50 dark:hover:bg-gray-700 transition-all group"
          >
            <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 font-medium">
              {item.name}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-all text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;