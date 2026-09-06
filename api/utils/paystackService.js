// services/paystackService.js
import axios from 'axios';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const { PAYSTACK_SECRET_KEY } = process.env;
const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});

export const initializeTransaction = async ({ email, amount, reference, callback_url }) => {
  const { data } = await paystack.post('/transaction/initialize', {
    email,
    amount, // kobo
    reference,
    callback_url,
  });
  return data.data; // { authorization_url, access_code, reference }
};

export const verifyTransaction = async (reference) => {
  const { data } = await paystack.get(`/transaction/verify/${reference}`);
  return data.data; // { status, amount, reference, ... }
};
















const paystackHeaders = {
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
};

export const initializeTransaction2 = async ({ email, amountInKobo, reference, callbackUrl, metadata }) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: paystackHeaders,
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize Paystack transaction');
  }
  return data.data; // { authorization_url, access_code, reference }
};

export const verifyTransaction2 = async (reference) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    method: 'GET',
    headers: paystackHeaders,
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || 'Failed to verify Paystack transaction');
  }
  return data.data; // { status: 'success' | 'failed' | ..., amount, reference, ... }
};