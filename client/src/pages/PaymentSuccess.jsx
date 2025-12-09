// src/pages/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Payment successful! Your plan is now active');
    
    // Wait small, then go dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center max-w-md">
        <CheckCircle2 className="h-24 w-24 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your subscription is now active
        </p>
        <p className="text-sm text-gray-500 mt-6">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;