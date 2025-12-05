/* eslint-disable react-refresh/only-export-components */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create the Auth Context
// const AuthContext = createContext(undefined);

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // On app load: check if user is already logged in (from localStorage)
//   useEffect(() => {
//     const loadUser = () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('token');

//         if (storedUser && token) {
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (err) {
//         console.error('Failed to load user from storage', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   // Login function (demo version - replace with real API call later)
//   const login = async (email, password) => {
//     setIsLoading(true);
//     try {
//       // Basic validation
//       if (!email || !password) {
//         throw new Error('Email and password are required');
//       }

//       // Mock successful login
//       const isAdmin = email.toLowerCase().includes('admin');
//       const mockUser = {
//         id: Date.now().toString(),
//         name: email.split('@')[0],
//         email,
//         avatar: `https://i.pravatar.cc/150?u=${email}`,
//         role: isAdmin ? 'admin' : 'user',
//       };

//       // Save to state and localStorage
//       setUser(mockUser);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//       localStorage.setItem('token', 'mock-jwt-token-' + Date.now());

//       console.log('Logged in as:', mockUser);
//     } catch (error) {
//       console.error('Login failed:', error.message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Register function (demo version)
//   const register = async (name, email, password) => {
//     setIsLoading(true);
//     try {
//       if (!name || !email || !password) {
//         throw new Error('All fields are required');
//       }

//       const mockUser = {
//         id: Date.now().toString(),
//         name,
//         email,
//         avatar: `https://i.pravatar.cc/150?u=${email}`,
//         role: 'user',
//       };

//       setUser(mockUser);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//       localStorage.setItem('token', 'mock-jwt-token-' + Date.now());

//       console.log('Registered & logged in:', mockUser);
//     } catch (error) {
//       console.error('Registration failed:', error.message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     console.log('Logged out');
//   };

//   // Context value
//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     register,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth anywhere
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };




// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch current user on app load
  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.data.user);
      } else {
        // Token invalid/expired → logout
        localStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);