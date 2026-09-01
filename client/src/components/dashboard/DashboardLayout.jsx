





import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import Overview from './Overview';


const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState(<Overview />);

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-24 left-4 z-50 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-all duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          onClose={() => setIsMobileMenuOpen(false)} 
          setCurrentView={setCurrentView} 
        />
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 lg:p-10">
          {currentView}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;