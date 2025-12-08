// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/auth/Login';  // You can uncomment this later
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import NavbarLayout from './components/layout/NavbarLayout';
import AdminDashboardLayout from './pages/admin.jsx/AdminDashboard';
import AdminLogin from './pages/admin.jsx/AdminLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pages WITH Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars" element={<div>Cars Page</div>} />
          <Route path="/auctions" element={<div>Auctions</div>} />
            <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />

          {/* Add more pages here */}
        </Route>

        <Route element={<NavbarLayout />}>
            
        <Route path="/dashboard" element={<DashboardLayout />} />
            
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />} />
      
        <Route path="/admin/login" element={<AdminLogin />} />


        </Route>

        {/* Pages WITHOUT Navbar + Footer */}
      
       
      </Routes>
    </Router>
  );
};

export default App;