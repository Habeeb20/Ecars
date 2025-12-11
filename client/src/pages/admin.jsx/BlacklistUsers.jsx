// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Loader2, 
//   Search, 
//   UserX, 
//   UserCheck, 
//   AlertCircle, 
//   CheckCircle,
//   Trash2
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const AdminBlacklist = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [blacklistReason, setBlacklistReason] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     fetchBlacklistedUsers();
//   }, []);

//   const fetchBlacklistedUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklisted`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') {
//         setUsers(data.data.blacklistedUsers);
//       }
//     } catch (err) {
//       toast.error('Failed to load blacklisted users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlacklist = async (userId) => {
//     if (!blacklistReason.trim()) {
//       toast.error('Please provide a reason');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklist`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId, reason: blacklistReason }),
//       });

//       const data = await res.json();
//       if (data.status === 'success') {
//         toast.success('User blacklisted successfully');
//         setBlacklistReason('');
//         setSelectedUser(null);
//         fetchBlacklistedUsers();
//       }
//     } catch (err) {
//       toast.error('Failed to blacklist user');
//     }
//   };

//   const handleUnblacklist = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklist/${userId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (data.status === 'success') {
//         toast.success('User unblacklisted successfully');
//         fetchBlacklistedUsers();
//       }
//     } catch (err) {
//       toast.error('Failed to unblacklist user');
//     }
//   };

//   const filteredUsers = users.filter(user =>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
//             Blacklist Management
//           </h1>
//           <div className="mt-4 md:mt-0 relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by name or email..."
//               className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-md"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Blacklist Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//             Blacklist a User
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="text"
//               value={selectedUser?.email || ''}
//               onChange={(e) => setSelectedUser({ email: e.target.value })}
//               placeholder="Enter user email or ID"
//               className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
//             />
//             <input
//               type="text"
//               value={blacklistReason}
//               onChange={(e) => setBlacklistReason(e.target.value)}
//               placeholder="Reason for blacklisting"
//               className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
//             />
//             <button
//               onClick={() => handleBlacklist(selectedUser?.id)}
//               className="md:col-span-2 py-4 px-6 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
//             >
//               Blacklist User
//             </button>
//           </div>
//         </div>

//         {/* Blacklisted Users List */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
//           </div>
//         ) : filteredUsers.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No blacklisted users
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               All users are currently allowed
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Phone</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Reason</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Blacklisted By</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
//                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {filteredUsers.map(user => (
//                     <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                             <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
//                           </div>
//                           <div className="ml-3">
//                             <p className="font-medium text-gray-900 dark:text-white">
//                               {user.firstName} {user.lastName}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
//                         {user.email}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
//                         {user.phoneNumber || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
//                         {user.blacklistedReason}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
//                         {user.blacklistedBy?.firstName} {user.blacklistedBy?.lastName}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
//                         {new Date(user.blacklistedAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleUnblacklist(user._id)}
//                           className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
//                         >
//                           <UserCheck className="h-5 w-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminBlacklist;




/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  UserX, 
  UserCheck, 
  AlertCircle, 
  CheckCircle,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminBlacklist = () => {
  const [allUsers, setAllUsers] = useState([]);           // All users on platform
  const [blacklistedUsers, setBlacklistedUsers] = useState([]); // Blacklisted only
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(''); // For dropdown

  useEffect(() => {
    fetchAllUsers();
    fetchBlacklistedUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAllUsers(data.data.users);
      }
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const fetchBlacklistedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklisted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBlacklistedUsers(data.data.blacklistedUsers);
      }
    } catch (err) {
      toast.error('Failed to load blacklisted users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlacklist = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    if (!blacklistReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUserId, reason: blacklistReason }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        toast.success('User blacklisted successfully');
        setBlacklistReason('');
        setSelectedUserId('');
        fetchBlacklistedUsers();
      }
    } catch (err) {
      toast.error('Failed to blacklist user');
    }
  };

  const handleUnblacklist = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/blacklist/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === 'success') {
        toast.success('User unblacklisted successfully');
        fetchBlacklistedUsers();
      }
    } catch (err) {
      toast.error('Failed to unblacklist user');
    }
  };

  const filteredBlacklisted = blacklistedUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = allUsers.find(u => u._id === selectedUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Blacklist Management
          </h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blacklisted users..."
              className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Blacklist Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Blacklist a User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full h-12 px-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 shadow-md appearance-none"
              >
                <option value="">Choose a user...</option>
                {allUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-10 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Blacklisting
              </label>
              <input
                type="text"
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                placeholder="e.g. Fraudulent activity, spam, violation..."
                className="w-full h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 shadow-md"
              />
            </div>

            {/* Blacklist Button */}
            <div className="flex items-end">
              <button
                onClick={handleBlacklist}
                disabled={!selectedUserId || !blacklistReason.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Blacklist User
              </button>
            </div>
          </div>
        </div>

        {/* Blacklisted Users List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
          </div>
        ) : filteredBlacklisted.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <UserX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blacklisted users
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All users are currently allowed
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Blacklisted By</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBlacklisted.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.blacklistedReason}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.blacklistedBy?.firstName} {user.blacklistedBy?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.blacklistedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUnblacklist(user._id)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
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

export default AdminBlacklist;