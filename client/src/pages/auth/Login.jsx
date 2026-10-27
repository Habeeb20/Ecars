



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Phone, Lock, ArrowLeft, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
// import { Mail, Lock, ArrowLeft, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  // const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { login } = useAuth();

  // E-Auth modal: 'email' step (collect address, request OTP) then 'otp' step (verify + sign in)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState('email');
  const [authEmail, setAuthEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const from = location.state?.from?.pathname || '/dashboard';

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthStep('email');
    setAuthEmail('');
    setOtp('');
  };

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
  identifier: identifier.includes('@')
    ? identifier.toLowerCase().trim()
    : identifier.trim(),
  password,
}),
        // body: JSON.stringify({
        //   email: email.toLowerCase().trim(),
        //   password,
        // }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        await login(data.token);
        toast.success('Welcome back! Login successful');

        setTimeout(() => {
          navigate(data.user?.role === 'agent' ? '/agent' : from, { replace: true });
          // navigate(from, { replace: true });
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

  // STEP 1: send the OTP to the entered email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/users/auth-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        toast.success('A 4-digit code has been sent to your email');
        setAuthStep('otp');
      } else {
        toast.error(data.message || 'Could not send the OTP');
      }
    } catch (error) {
      console.error('Request OTP error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: verify the OTP and sign in
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error('Enter the 4-digit code sent to your email');
      return;
    }
    setOtpSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/users/verify-auth-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim(), otp }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        await login(data.token);
        toast.success('Welcome back! E-Auth login successful');
        setTimeout(() => {
          navigate(from, { replace: true });
          closeAuthModal();
        }, 800);
      } else {
        toast.error(data.message || 'Incorrect or expired code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch(`${backendUrl}/users/auth-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success('A new code has been sent');
        setOtp('');
      } else {
        toast.error(data.message || 'Could not resend the code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setResending(false);
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
          {/* <div className="relative">
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
          </div> */}


          {/* Email or phone */}
<div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
    {identifier && !identifier.includes('@') ? (
      <Phone className="h-5 w-5 text-gray-400" />
    ) : (
      <Mail className="h-5 w-5 text-gray-400" />
    )}
  </div>
  <input
    type="text"
    required
    autoComplete="username"
    placeholder="Email or phone number"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
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
            className="w-full flex justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
                onClick={closeAuthModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {authStep === 'email' ? (
                <>
                  <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                    Login with E-Auth
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Enter your email to receive a 4-digit login code
                  </p>

                  <form onSubmit={handleRequestOtp} className="space-y-6">
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !authEmail.trim()}
                      className="w-full flex justify-center py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          Sending code...
                        </span>
                      ) : (
                        'Send Login Code'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                    Enter your code
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    We sent a 4-digit code to <span className="font-medium">{authEmail}</span>
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      required
                      autoFocus
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      disabled={otpSubmitting}
                      className="w-full text-center text-3xl font-bold tracking-[0.6em] pl-2 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={otpSubmitting || otp.length !== 4}
                      className="w-full flex justify-center py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpSubmitting ? (
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
                          Verifying...
                        </span>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => { setAuthStep('email'); setOtp(''); }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Change email
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      >
                        {resending ? 'Resending...' : 'Resend code'}
                      </button>
                    </div>
                  </form>
                </>
              )}
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



















