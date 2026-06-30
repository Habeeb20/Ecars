// // components/analytics/RecordSaleModal.jsx
// import { useState } from 'react';
// import { X, Loader2 } from 'lucide-react';
// import { recordSale } from './UseSalesAnalytics';

// import { toast } from 'sonner';

// const NIGERIAN_STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
//   'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
//   'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
//   'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
//   'Yobe','Zamfara',
// ];

// const PAYMENT_METHODS = ['cash','bank_transfer','pos','cheque','installment','other'];
// const PAYMENT_STATUSES = ['paid','part_payment','pending'];

// const Field = ({ label, required, children }) => (
//   <div>
//     <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
//       {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//     </label>
//     {children}
//   </div>
// );

// const inputCls = "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 transition";

// export default function RecordSaleModal({ listings = [], onClose, onSuccess }) {
//   const [form, setForm] = useState({
//     carListingId:  '',
//     salePrice:     '',
//     discount:      '',
//     paymentMethod: 'cash',
//     paymentStatus: 'paid',
//     amountPaid:    '',
//     notes:         '',
//     customer: {
//       name: '', email: '', phone: '', state: '', lga: '', idType: 'other', idNumber: '', notes: '',
//     },
//   });
//   const [saving, setSaving] = useState(false);

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
//   const setCust = (k, v) => setForm((p) => ({ ...p, customer: { ...p.customer, [k]: v } }));

//   const handleSubmit = async () => {
//     if (!form.carListingId)      return toast.error('Select a car listing');
//     if (!form.salePrice)         return toast.error('Enter sale price');
//     if (!form.customer.name)     return toast.error('Enter customer name');
//     if (!form.customer.phone)    return toast.error('Enter customer phone');

//     setSaving(true);
//     try {
//       await recordSale({
//         carListingId:  form.carListingId,
//         salePrice:     Number(form.salePrice),
//         discount:      Number(form.discount) || 0,
//         paymentMethod: form.paymentMethod,
//         paymentStatus: form.paymentStatus,
//         amountPaid:    Number(form.amountPaid) || Number(form.salePrice),
//         notes:         form.notes,
//         customerInfo:  form.customer,
//       });
//       toast.success('Sale recorded successfully');
//       onSuccess?.();
//       onClose();
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="bg-white dark:bg-gray-800 w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
//           <div>
//             <h2 className="text-base font-bold text-gray-900 dark:text-white">Record a sale</h2>
//             <p className="text-xs text-gray-400 mt-0.5">Fill in the sale and customer details</p>
//           </div>
//           <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition">
//             <X size={15} className="text-gray-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

//           {/* Car */}
//           <div>
//             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Car listing</p>
//             <Field label="Select listing" required>
//               <select value={form.carListingId} onChange={(e) => set('carListingId', e.target.value)} className={inputCls}>
//                 <option value="">Choose a listing…</option>
//                 {listings.map((l) => (
//                   <option key={l._id} value={l._id}>
//                     {l.stockNumber} — {l.year} {l.make} {l.model} ({new Intl.NumberFormat('en-NG').format(l.price)})
//                   </option>
//                 ))}
//               </select>
//             </Field>
//           </div>

//           {/* Financials */}
//           <div>
//             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Financials</p>
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Sale price (₦)" required>
//                 <input type="number" value={form.salePrice} onChange={(e) => set('salePrice', e.target.value)} placeholder="e.g. 5000000" className={inputCls} />
//               </Field>
//               <Field label="Discount (₦)">
//                 <input type="number" value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" className={inputCls} />
//               </Field>
//               <Field label="Payment method" required>
//                 <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inputCls}>
//                   {PAYMENT_METHODS.map((m) => (
//                     <option key={m} value={m}>{m.replace('_', ' ')}</option>
//                   ))}
//                 </select>
//               </Field>
//               <Field label="Payment status" required>
//                 <select value={form.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)} className={inputCls}>
//                   {PAYMENT_STATUSES.map((s) => (
//                     <option key={s} value={s}>{s.replace('_', ' ')}</option>
//                   ))}
//                 </select>
//               </Field>
//               {form.paymentStatus !== 'paid' && (
//                 <Field label="Amount paid (₦)" required>
//                   <input type="number" value={form.amountPaid} onChange={(e) => set('amountPaid', e.target.value)} placeholder="0" className={`${inputCls} col-span-2`} />
//                 </Field>
//               )}
//             </div>
//           </div>

//           {/* Customer */}
//           <div>
//             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Customer info</p>
//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Full name" required>
//                 <input value={form.customer.name} onChange={(e) => setCust('name', e.target.value)} placeholder="John Doe" className={inputCls} />
//               </Field>
//               <Field label="Phone" required>
//                 <input value={form.customer.phone} onChange={(e) => setCust('phone', e.target.value)} placeholder="+2348..." className={inputCls} />
//               </Field>
//               <Field label="Email">
//                 <input value={form.customer.email} onChange={(e) => setCust('email', e.target.value)} placeholder="john@example.com" className={inputCls} />
//               </Field>
//               <Field label="State">
//                 <select value={form.customer.state} onChange={(e) => setCust('state', e.target.value)} className={inputCls}>
//                   <option value="">Select state</option>
//                   {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </Field>
//               <Field label="LGA">
//                 <input value={form.customer.lga} onChange={(e) => setCust('lga', e.target.value)} placeholder="LGA" className={inputCls} />
//               </Field>
//               <Field label="ID type">
//                 <select value={form.customer.idType} onChange={(e) => setCust('idType', e.target.value)} className={inputCls}>
//                   {['nin','bvn','drivers_license','passport','other'].map((t) => (
//                     <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
//                   ))}
//                 </select>
//               </Field>
//               <div className="col-span-2">
//                 <Field label="ID number">
//                   <input value={form.customer.idNumber} onChange={(e) => setCust('idNumber', e.target.value)} placeholder="ID number" className={inputCls} />
//                 </Field>
//               </div>
//               <div className="col-span-2">
//                 <Field label="Notes">
//                   <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Any additional notes…" className={`${inputCls} resize-none`} />
//                 </Field>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0 flex gap-3">
//           <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition"
//           >
//             {saving && <Loader2 size={14} className="animate-spin" />}
//             {saving ? 'Saving…' : 'Record sale'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






// components/analytics/RecordSaleModal.jsx
import { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { recordSale } from './UseSalesAnalytics';
import axios from "axios"
import { toast } from 'sonner';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

const PAYMENT_METHODS = ['cash','bank_transfer','pos','cheque','installment','other'];
const PAYMENT_STATUSES = ['paid','part_payment','pending'];

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 transition";

// ── fetch the dealer's own car listings ──────────────────────────────────────
function useMyCarListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data.data)
      
        const json = res.data.data;
        const all = Array.isArray(json) ? json : (json.listings ?? json.cars ?? []);
        // only listings that haven't been sold yet are eligible for a new sale
        setListings(all.filter((l) => l.status !== 'sold'));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { listings, loading, error };
}

export default function RecordSaleModal({ onClose, onSuccess }) {
  const { listings, loading: listingsLoading, error: listingsError } = useMyCarListings();

  const [form, setForm] = useState({
    carListingId:  '',
    salePrice:     '',
    discount:      '',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    amountPaid:    '',
    notes:         '',
    customer: {
      name: '', email: '', phone: '', state: '', lga: '', idType: 'other', idNumber: '', notes: '',
    },
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setCust = (k, v) => setForm((p) => ({ ...p, customer: { ...p.customer, [k]: v } }));

  // Auto-fill sale price with the listing's asking price when a car is selected
  const handleSelectListing = (id) => {
    set('carListingId', id);
    const chosen = listings.find((l) => l._id === id);
    if (chosen && !form.salePrice) {
      set('salePrice', String(chosen.price));
    }
  };

  const handleSubmit = async () => {
    if (!form.carListingId)      return toast.error('Select a car listing');
    if (!form.salePrice)         return toast.error('Enter sale price');
    if (!form.customer.name)     return toast.error('Enter customer name');
    if (!form.customer.phone)    return toast.error('Enter customer phone');

    setSaving(true);
    try {
      await recordSale({
        carListingId:  form.carListingId,
        salePrice:     Number(form.salePrice),
        discount:      Number(form.discount) || 0,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
        amountPaid:    Number(form.amountPaid) || Number(form.salePrice),
        notes:         form.notes,
        customerInfo:  form.customer,
      });
      toast.success('Sale recorded successfully');
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-800 w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Record a sale</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the sale and customer details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Car */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Car listing</p>

            {listingsError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-3 py-2.5 text-xs mb-3">
                <AlertTriangle size={13} className="shrink-0" />
                {listingsError}
              </div>
            )}

            <Field label="Select listing" required>
              <select
                value={form.carListingId}
                onChange={(e) => handleSelectListing(e.target.value)}
                disabled={listingsLoading || listings.length === 0}
                className={inputCls}
              >
                <option value="">
                  {listingsLoading
                    ? 'Loading your listings…'
                    : listings.length === 0
                    ? 'No active listings available'
                    : 'Choose a listing…'}
                </option>
                {listings.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.stockNumber} — {l.year} {l.make} {l.model} ({new Intl.NumberFormat('en-NG').format(l.price)})
                  </option>
                ))}
              </select>
            </Field>

            {!listingsLoading && listings.length === 0 && !listingsError && (
              <p className="text-[11px] text-gray-400 mt-1.5">
                You don't have any active car listings to sell. Upload a car first.
              </p>
            )}
          </div>

          {/* Financials */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Financials</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sale price (₦)" required>
                <input type="number" value={form.salePrice} onChange={(e) => set('salePrice', e.target.value)} placeholder="e.g. 5000000" className={inputCls} />
              </Field>
              <Field label="Discount (₦)">
                <input type="number" value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" className={inputCls} />
              </Field>
              <Field label="Payment method" required>
                <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inputCls}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m.replace('_', ' ')}</option>
                  ))}
                </select>
              </Field>
              <Field label="Payment status" required>
                <select value={form.paymentStatus} onChange={(e) => set('paymentStatus', e.target.value)} className={inputCls}>
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </Field>
              {form.paymentStatus !== 'paid' && (
                <Field label="Amount paid (₦)" required>
                  <input type="number" value={form.amountPaid} onChange={(e) => set('amountPaid', e.target.value)} placeholder="0" className={`${inputCls} col-span-2`} />
                </Field>
              )}
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Customer info</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" required>
                <input value={form.customer.name} onChange={(e) => setCust('name', e.target.value)} placeholder="John Doe" className={inputCls} />
              </Field>
              <Field label="Phone" required>
                <input value={form.customer.phone} onChange={(e) => setCust('phone', e.target.value)} placeholder="+2348..." className={inputCls} />
              </Field>
              <Field label="Email">
                <input value={form.customer.email} onChange={(e) => setCust('email', e.target.value)} placeholder="john@example.com" className={inputCls} />
              </Field>
              <Field label="State">
                <select value={form.customer.state} onChange={(e) => setCust('state', e.target.value)} className={inputCls}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="LGA">
                <input value={form.customer.lga} onChange={(e) => setCust('lga', e.target.value)} placeholder="LGA" className={inputCls} />
              </Field>
              <Field label="ID type">
                <select value={form.customer.idType} onChange={(e) => setCust('idType', e.target.value)} className={inputCls}>
                  {['nin','bvn','drivers_license','passport','other'].map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="ID number">
                  <input value={form.customer.idNumber} onChange={(e) => setCust('idNumber', e.target.value)} placeholder="ID number" className={inputCls} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Notes">
                  <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Any additional notes…" className={`${inputCls} resize-none`} />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || listingsLoading || listings.length === 0}
            className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Record sale'}
          </button>
        </div>
      </div>
    </div>
  );
}