import { useState, useEffect } from 'react';

import VerifyEmailModal from './VerifyEmailModal';
export const SomePage = () => {
  const [showVerify, setShowVerify] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is not verified
    const checkVerification = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.data.user.emailVerified) {
        setUserEmail(data.data.user.email);
        setShowVerify(true);
      }
    };
    checkVerification();
  }, []);

  return (
    <>
      {/* Your page content */}
      <VerifyEmailModal
        isOpen={showVerify}
        onClose={() => setShowVerify(false)}
        email={userEmail}
      />
    </>
  );
};