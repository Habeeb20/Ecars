/* eslint-disable no-unused-vars */
// pages/agent/AgentDashboard.jsx
// Route: <Route path="/agent" element={<AgentDashboard />} />
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Users, UserPlus, Wallet, Banknote, LogOut, Menu, X } from 'lucide-react';

import { agentApi } from '../../api/agentApi';
import AgentOverview from './components/AgentOverview';
import AgentReferrals from './components/AgentReferrals';
import AgentRegisterUser from './components/AgentRegister';
import AgentEarnings from './components/AgentEarnings';
import AgentPayouts from './components/AgentPayouts';

const NAV = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, Component: AgentOverview },
  { key: 'users', label: 'My users', icon: Users, Component: AgentReferrals },
  { key: 'register', label: 'Sign up a user', icon: UserPlus, Component: AgentRegisterUser },
  { key: 'earnings', label: 'Points & earnings', icon: Wallet, Component: AgentEarnings },
  { key: 'payouts', label: 'Payouts', icon: Banknote, Component: AgentPayouts },
];

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Only agents belong here: the API answers 403 to everyone else
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
      return;
    }
    agentApi
      .overview()
      .then((r) => setUser(r.data.agent))
      .catch((e) => {
        if (e.response?.status === 403) navigate('/dashboard', { replace: true });
        else if (e.response?.status === 401) navigate('/login', { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tab = NAV.some((n) => n.key === params.get('tab')) ? params.get('tab') : 'overview';
  const active = NAV.find((n) => n.key === tab);
  const ActiveComponent = active.Component;

  const go = (key) => {
    setParams({ tab: key });
    setOpen(false);
    window.scrollTo({ top: 0 });
  };

  const logout = () => {
    ['token', 'user', 'userId'].forEach((k) => localStorage.removeItem(k));
    window.location.href = '/login';
  };

  const initials = `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || ''}`.toUpperCase();

  const Sidebar = (
    <div className="h-full flex flex-col bg-[#0F1A2B] text-slate-300">
      <div className="px-6 pt-7 pb-6">
        <p className="text-white text-lg font-bold tracking-tight">ECARS</p>
        <p className="text-xs text-slate-400 mt-0.5">Agent workspace</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ key, label, icon: Icon }) => {
          const on = key === tab;
          return (
            <button
              key={key}
              onClick={() => go(key)}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                on ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {on && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-emerald-400" />}
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">{Sidebar}</aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#0F1A2B] text-white flex items-center justify-between px-4 h-14">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-sm">{active.label}</span>
        <span className="w-5" />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-400 z-10" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ActiveComponent onNavigate={go} />
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;