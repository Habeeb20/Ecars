/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Eye, Mail, Check, X, Search, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem('adminToken'); // Adjust if different

  useEffect(() => {
    fetchContacts(currentPage, search);
  }, [currentPage, search]);

  const fetchContacts = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/contact`, {
     
        params: { page, limit: 10, search: searchTerm },
           headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data.data.contacts || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Marked as read');
      fetchContacts(currentPage, search);
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Messages
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            All user inquiries in one place
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-500 shadow-sm"
          />
        </div>

        {/* Contacts Table */}
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    Loading contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    No contact messages found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <React.Fragment key={contact._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{contact.subject}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {format(new Date(contact.createdAt), "MMM d, yyyy h:mm a")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.read ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {contact.read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedId === contact._id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleMarkRead(contact._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Read
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <Mail className="w-4 h-4" />
                                Reply
                              </button>
                              <button
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <X className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;