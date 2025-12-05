/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { Car, User, Menu, X, Sun, Moon, MessageSquare, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // null or string like 'marketplace', 'user'
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navCategories = {
    marketplace: {
      label: 'Marketplace',
      links: [
        { path: '/cars', label: 'Browse Cars' },
        { path: '/sell-car', label: 'Sell a Car' },
        { path: '/car-parts', label: 'Car Parts' },
        { path: '/compare', label: 'Compare Cars' },
      ]
    },
    services: {
      label: 'Services',
      links: [
        { path: '/service-providers', label: 'Services Providers' },
        { path: '/dealerships', label: 'Dealerships' },
        { path: '/value-asset', label: 'Value Asset' },
        { path: '/auctions', label: 'Auctions' },
      ]
    },
    safety: {
      label: 'Safety',
      links: [
        { path: '/stolen-cars', label: 'Stolen Cars' },
        { path: '/blacklist', label: 'Blacklist' },
      ]
    },
    resources: {
      label: 'Resources',
      links: [
        { path: '/blog', label: 'Blog' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
      ]
    },
    vehicle: {
      label: 'Vehicles',
      links: [
        { path: '/vehicles', label: 'Vehicles' },
      ]
    },
  };

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navbarBgClass = isScrolled || !isHomePage
    ? 'bg-white dark:bg-gray-900 shadow-md'
    : 'bg-transparent';

  // Fixed: Accept the key as parameter
  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBgClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600 dark:text-primary-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">E-Cars</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {Object.entries(navCategories).map(([key, category]) => (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <span>{category.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {activeDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700"
                    >
                      {category.links.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setActiveDropdown(null)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-700'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu or Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border-2 border-primary-500 object-cover"
                  />
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </button>

                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                    >
                      <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setActiveDropdown(null)}>
                        Dashboard
                      </Link>
                      <Link to="/dashboard/listings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setActiveDropdown(null)}>
                        My Listings
                      </Link>
                      <Link to="/dashboard/messages" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setActiveDropdown(null)}>
                        Messages
                      </Link>
                      <button
                        onClick={() => { logout(); setActiveDropdown(null); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {Object.entries(navCategories).map(([key, category]) => (
                <div key={key}>
                  <button
                    onClick={() => toggleDropdown(key)}
                    className="flex items-center justify-between w-full py-3 text-left font-medium"
                  >
                    {category.label}
                    <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === key && (
                    <div className="pl-4 mt-2 space-y-2">
                      {category.links.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-gray-600 dark:text-gray-400"
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              {!user ? (
                <div className="pt-4 space-y-3 border-t dark:border-gray-800">
                  <Link to="/login" className="block py-3 text-center">Log In</Link>
                  <Link to="/register" className="block py-3 text-center bg-primary-600 text-white rounded-lg">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-3 border-t dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Link to="/dashboard" className="block py-2">Dashboard</Link>
                  <Link to="/dashboard/messages" className="block py-2">Messages</Link>
                  <button onClick={logout} className="flex items-center space-x-2 py-2 text-red-600">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};