// hooks/useSalesAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export function useSalesOverview() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/sales/analytics/overview`, { headers: authHeaders() });
  
        console.log(res.data)
        setData(res.data);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  return { data, loading, error };
}

export function useMonthlyBreakdown(year) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/sales/analytics/monthly?year=${year}`, { headers: authHeaders() });
        const json = await res.json();
        setData(json.months || []);
      } catch { setData([]); }
      finally { setLoading(false); }
    })();
  }, [year]);

  return { data, loading };
}

export function useTopCars() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/sales/analytics/top-cars?limit=6`, { headers: authHeaders() });
        setData(await res.json());
      } catch { setData([]); }
      finally { setLoading(false); }
    })();
  }, []);

  return { data, loading };
}

export function usePaymentMethods() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/sales/analytics/payment-methods`, { headers: authHeaders() });
        setData(await res.json());
      } catch { setData([]); }
      finally { setLoading(false); }
    })();
  }, []);

  return { data, loading };
}

export function useRecentSales() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/sales/analytics/recent?limit=8`, { headers: authHeaders() });
        setData(await res.json());
      } catch { setData([]); }
      finally { setLoading(false); }
    })();
  }, []);

  return { data, loading };
}

export function useSales(filters) {
  const [data, setData]       = useState({ sales: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== ''))
      );
      const res = await fetch(`${API}/api/sales?${params}`, { headers: authHeaders() });
      setData(await res.json());
    } catch { /* noop */ }
    finally { setLoading(false); }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, refetch: fetch_ };
}

export function useCustomers(filters) {
  const [data, setData]       = useState({ customers: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== ''))
      );
      const res = await fetch(`${API}/api/sales/customers?${params}`, { headers: authHeaders() });
      setData(await res.json());
    } catch { /* noop */ }
    finally { setLoading(false); }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, refetch: fetch_ };
}

export async function recordSale(payload) {
  const res = await fetch(`${API}/api/sales`, {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to record sale');
  return json;
}