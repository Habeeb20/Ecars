



// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/users/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email.toLowerCase().trim(),
//           password,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.status === 'success') {
//         // Save token
//         localStorage.setItem('token', data.token);

//         toast.success('Welcome back! Login successful');

//         // Redirect with small delay so toast shows
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 800);
//       } else {
//         // Show exact backend message
//         toast.error(data.message || 'Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


  
//   const handleAuthLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/users/auth-login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email.toLowerCase().trim(),
      
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.status === 'success') {
//         // Save token
//         localStorage.setItem('token', data.token);

//         toast.success('Welcome back! Login successful');

//         // Redirect with small delay so toast shows
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 800);
//       } else {
//         // Show exact backend message
//         toast.error(data.message || 'Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error('Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 my-12">
//       <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Don't have an account?{' '}
//             <Link
//               to="/register"
//               className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
//             >
//               Create one here
//             </Link>
//           </p>
//         </div>

//         {/* Form */}
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Email */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//               <Mail className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="email"
//               required
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isLoading}
//               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
//             />
//           </div>

//           {/* Password with Eye Toggle */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//               <Lock className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               required
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isLoading}
//               className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//             >
//               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//             </button>
//           </div>

//           {/* Options */}
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
//               />
//               <label htmlFor="remember-me" className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">
//                 Remember me
//               </label>
//             </div>
//             <Link
//               to="/forgot-password"
//               className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <span className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Signing in...
//               </span>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>

//         {/* Back to Home */}
//         <div className="text-center">
//           <Link
//             to="/"
//             className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;






import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation()
  // New states for E-Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
 const from = location.state?.from?.pathname || "/dashboard";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back! Login successful');

        setTimeout(() => {
          navigate(from, { replace: true }); 
          // navigate('/dashboard');
        }, 800);
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginEmail = authEmail.trim() || email.toLowerCase().trim();

    try {
      const res = await fetch(`${backendUrl}/users/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back! E-Auth login successful');

        setTimeout(() => {
             navigate(from, { replace: true }); 
          // navigate('/dashboard');
          setShowAuthModal(false);
          setAuthEmail('');
        }, 800);
      } else {
        toast.error(data.message || 'E-Auth failed');
      }
    } catch (error) {
      console.error('Auth login error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 my-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Main Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Main Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* ─── E-Auth Button ──────────────────────────────────────────────── */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Login with E-Auth
          </button>
        </div>

        {/* ─── E-Auth Modal ───────────────────────────────────────────────── */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthEmail('');
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Login with E-Auth
              </h3>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Enter your email to receive a secure authentication link
              </p>

              <form
                onSubmit={handleAuthLogin}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value.toLowerCase().trim())}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !authEmail.trim()}
                  className="w-full flex justify-center py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Send Login Link'
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                Check your email for the secure login link
              </p>
            </motion.div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;






