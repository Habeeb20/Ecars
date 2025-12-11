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
import PaymentSuccess from './pages/PaymentSuccess';
import StolenCars from './pages/StolenCars';
import Vehicles from './pages/Vehicles';
import Article from './pages/Article';
import CarDetails from './pages/CarDetails';
import SellCar from './pages/SellCar';
import Listings from './components/Landing/Cars';
import ValueAsset from './pages/ValueAsset';
import Dealership from './components/Landing/DealerShip';
import DealerDetails from './components/Landing/DealerDetails';
import ServiceProvider from './components/Landing/ServiceProvider';
import Blog from './components/Landing/Blog';
import Blacklist from './pages/Blacklist';

// import Blog from './pages/Blog';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Pages WITH Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars" element={<Listings/>} />
          <Route path="/auctions" element={<div>Auctions</div>} />
            <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path="/payment/success" element={<PaymentSuccess/>} />
        <Route path="/stolen-cars" element={<StolenCars/>} />
        <Route path="/vehicles" element={<Vehicles/>} />
        <Route path="/blog/:id" element={<Article/>} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/dealerships" element={<Dealership />} />
        <Route path='/dealers/:id' element={<DealerDetails />} />
        <Route path="/sell-car" element={<SellCar />} />
        <Route path="/value-asset" element={<ValueAsset />} />
        <Route path="/blog" element={<Blog />} />
        
        <Route path="/blacklist" element={<Blacklist />} />
        
        <Route path="/service-providers" element={<ServiceProvider />} />
        


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