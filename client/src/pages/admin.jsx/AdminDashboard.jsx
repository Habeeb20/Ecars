// src/pages/admin/DashboardLayout.jsx
import { useState } from 'react';
import Overview from './Overview';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminDashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState(<Overview />);

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-20">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-24 left-4 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-full overflow-y-auto
        `}
      >
        <Sidebar
          onClose={() => setIsMobileMenuOpen(false)}
          setCurrentView={setCurrentView}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 lg:p-10">
          {currentView}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;