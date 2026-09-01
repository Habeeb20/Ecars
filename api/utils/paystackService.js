// services/paystackService.js
import axios from 'axios';

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