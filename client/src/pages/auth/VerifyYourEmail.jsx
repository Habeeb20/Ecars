// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, Loader2, ArrowRight, MailCheck, 
  ShieldCheck, Clock, Home 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const { token } = useParams(); // token from URL: /verify-email/:token
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | error | expired
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5); // for auto-redirect

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/verify-email/${token}`
        );

        if (res.data.status === 'success') {
          setStatus('success');
          setMessage(res.data.message || 'Your email has been successfully verified!');
          
          // Auto-redirect countdown
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/login'); // or '/dashboard'
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          throw new Error(res.data.message || 'Verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        
        const errMsg = err.response?.data?.message || err.message;
        
        if (errMsg.toLowerCase().includes('expired')) {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new one.');
        } else if (errMsg.toLowerCase().includes('already')) {
          setStatus('success'); // treat as already verified
          setMessage('Your email is already verified. You can now log in.');
        } else {
          setStatus('error');
          setMessage(errMsg || 'Failed to verify email. The link may be invalid or expired.');
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-20 w-20 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-20 w-20 text-red-500" />;
      default:
        return <Loader2 className="h-20 w-20 text-indigo-600 animate-spin" />;
    }
  };

  const getBgGradient = () => {
    switch (status) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
      case 'expired':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header Gradient */}
        <div className={`bg-gradient-to-r ${getBgGradient()} p-10 text-center`}>
          {getIcon()}
          <h1 className="mt-6 text-3xl font-bold text-white">
            {status === 'loading' && 'Verifying Your Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'expired' && 'Link Expired'}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 text-center">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {status === 'loading' && 'Please wait while we confirm your email address...'}
            {status === 'success' && message}
            {status === 'error' && message}
            {status === 'expired' && message}
          </p>

          {/* Auto-redirect countdown on success */}
          {status === 'success' && countdown > 0 && (
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login in {countdown} seconds...
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === 'success' && (
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
              >
                <ShieldCheck size={20} />
                Go to Login
              </button>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <button
                  onClick={() => navigate('/resend-verification')}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
                >
                  <MailCheck size={20} />
                  Request New Verification Link
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 transition flex items-center justify-center gap-3"
                >
                  <Home size={20} />
                  Back to Home
                </button>
              </>
            )}

            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600">This may take a few seconds...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-6 px-8 text-center text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} ECARS • All rights reserved
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;