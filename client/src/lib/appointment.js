export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 17;
export const MIN_LEAD_HOURS = 2;
export const DAYS_AHEAD = 14;

const TZ = 'Africa/Lagos';
const BASE = `${import.meta.env.VITE_BACKEND_URL}/appointments`;

const request = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const appointmentApi = {
  getAvailability: (carId, from, to) =>
    request(`/car/${carId}/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  create: (payload) => request('/', { method: 'POST', body: JSON.stringify(payload) }),
  mine: () => request('/my'),
  received: () => request('/received'),
  updateStatus: (id, status, reason) =>
    request(`/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }),
};

// "2026-10-12" in Lagos time
const toLagosDateStr = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);

export const getNextDays = (count = DAYS_AHEAD) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    return {
      dateStr: toLagosDateStr(d),
      weekday: d.toLocaleDateString('en-NG', { weekday: 'short', timeZone: TZ }),
      day: d.toLocaleDateString('en-NG', { day: 'numeric', timeZone: TZ }),
      month: d.toLocaleDateString('en-NG', { month: 'short', timeZone: TZ }),
    };
  });

// 30-minute slots between opening and closing time, as Date objects
export const buildSlots = (dateStr) => {
  const slots = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(new Date(`${dateStr}T${hh}:${mm}:00+01:00`));
    }
  }
  return slots;
};

export const dayRangeISO = (dateStr) => ({
  from: new Date(`${dateStr}T00:00:00+01:00`).toISOString(),
  to: new Date(`${dateStr}T23:59:59+01:00`).toISOString(),
});

export const formatTime = (d) =>
  new Date(d).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', timeZone: TZ });

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });