
// // contexts/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from 'sonner';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   // Fetch current user on app load
//   const fetchUser = async () => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${backendUrl}/users/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setUser(data.data.user);
//       } else {
//         // Token invalid/expired → logout
//         localStorage.removeItem('token');
//         toast.error('Session expired. Please log in again.');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Logged out successfully');
//     window.location.href = '/login';
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, loading, refetch: fetchUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetches the current user using whatever token is currently in
  // localStorage. Returns the user object on success, or null on failure.
  // Doesn't toast on missing token (that's just "not logged in"), but does
  // toast on a genuinely bad/expired token or network failure.
  const fetchUser = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
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
        return data.data.user;
      } else {
        // Token invalid/expired → logout
        localStorage.removeItem('token');
        setUser(null);
        if (!silent) toast.error('Session expired. Please log in again.');
        return null;
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error('Failed to load user');
      return null;
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Call this right after a successful login/register/e-auth response.
  // Stores the token AND immediately hydrates `user` in context, so
  // components reading useAuth() see the logged-in state without needing
  // a page refresh (which is what the old flow relied on via the mount
  // effect below).
  const login = useCallback(async (token) => {
    if (!token) return null;
    localStorage.setItem('token', token);
    setLoading(true);
    // silent: a fresh token from a login response should never show a
    // "session expired" toast if something's off — that message only
    // makes sense for an existing/stale token going bad.
    return fetchUser({ silent: true });
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);