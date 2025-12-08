// src/components/VerifyEmailModal.jsx
import { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmailModal = ({ isOpen, onClose, email }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const resendEmail = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/send-verification-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSent(true);
        toast.success('Verification email sent!');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
        console.log(err)
      toast.error('Network error');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Gradient Top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-3xl opacity-90"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 text-center mt-8">
          {/* Icon */}
          {sent ? (
            <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-14 w-14 text-orange-600 dark:text-orange-400" />
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            {sent ? 'Email Sent!' : 'Verify Your Email'}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We sent a verification link to:
          </p>
          <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
            {email}
          </p>

          {sent ? (
            <p className="text-sm text-gray-500 mt-6">
              Check your inbox (and spam folder) for the verification link.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-6">
              Click the button below to resend the verification email.
            </p>
          )}

          {/* Resend Button */}
          <button
            onClick={resendEmail}
            disabled={sending}
            className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {sending ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : sent ? (
              'Resend Verification Email'
            ) : (
              'Send Verification Email'
            )}
          </button>

          <p className="text-xs text-gray-400 mt-6">
            This link expires in 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;