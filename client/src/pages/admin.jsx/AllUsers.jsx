// src/pages/admin/components/AllUsers.jsx
import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Shield, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleManualVerify = async (userId, email) => {
  if (!confirm(`Verify email for ${email}?\nThis cannot be undone.`)) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}/verify-email`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.status === 'success') {
      toast.success(`Email verified for ${email}`);
      // Refresh user list
      fetchUsers();
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    console.log(err)
    toast.error('Failed to verify email');
  }
};

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsers(data.data.users);
      }
    } catch (err) {
        console.log(err)
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const styles = {
      superadmin: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      dealer: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'service-provider': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      user: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[role] || styles.user}`}>
        {role.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All Users</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.uniqueNumber}</p>
                </div>
              </div>

          
{!user.emailVerified && (
  <button
    onClick={() => handleManualVerify(user._id, user.email)}
    className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
  >
    <CheckCircle2 className="h-5 w-5" />
    Verify Email Manually
  </button>
)}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">{user.phoneNumber}</span>
                  </div>
                )}
                <div className="pt-2">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;