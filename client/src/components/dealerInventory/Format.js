// utils/format.js
export const formatNaira = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n || 0);

export const formatShortNaira = (n = 0) => {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatRelative = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}yr ago`;
};

export const PAYMENT_LABELS = {
  cash: 'Cash', bank_transfer: 'Bank Transfer', pos: 'POS',
  cheque: 'Cheque', installment: 'Installment', other: 'Other',
};

export const PAYMENT_STATUS_COLORS = {
  paid:         'bg-green-50 text-green-700',
  part_payment: 'bg-amber-50 text-amber-700',
  pending:      'bg-red-50 text-red-600',
};