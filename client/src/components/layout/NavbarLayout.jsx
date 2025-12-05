// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Footer from './Footer';

const NavbarLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />  {/* This renders the page (Home, About, etc.) */}
      </main>
     
    </div>
  );
};

export default NavbarLayout ;