/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const AdminMessages = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'Habeeb') {
      setAuthenticated(true);
      fetchAllMessages();
    } else {
      toast.error('Incorrect password');
    }
  };

  const fetchAllMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <ShieldAlert className="h-20 w-20 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter password to view all user messages</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">
              Access Messages
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-8">
          All User Messages
        </h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">From</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">To</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {messages.map(msg => (
                    <tr key={msg._id}>
                      <td className="px-6 py-4">{msg.sender.firstName} {msg.sender.lastName}</td>
                      <td className="px-6 py-4">{msg.recipient.firstName} {msg.recipient.lastName}</td>
                      <td className="px-6 py-4 max-w-md truncate">{msg.content}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;