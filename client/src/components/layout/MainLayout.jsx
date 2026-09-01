// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Footer from './Footer';
import ExchangeRateTicker from '../Landing/ExchangeRateTicket';

// const MainLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
     
//       <main className="flex-1">
//          <ExchangeRateTicker />
//         <Outlet />  {/* This renders the page (Home, About, etc.) */}
//       </main>
//       <Footer />
//     </div>
//   );
// };




const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExchangeRateTicker />   {/* moved above Navbar — true "top of page" */}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};


export default MainLayout;