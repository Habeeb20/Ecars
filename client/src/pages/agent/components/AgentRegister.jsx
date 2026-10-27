// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { agentApi, errMsg } from '../../../api/agentApi';
// import { statesAndLgas } from '../../../utils/stateAndLga'; // same file your Register page uses
// import { Card, PageHeader } from './UI';

// const STATES = Object.keys(statesAndLgas);

// const ROLES = [
//   { value: 'user', label: 'Buyer' },
//   { value: 'dealer', label: 'Car dealer' },
//   { value: 'service-provider', label: 'Service provider' },
//   { value: 'carPart-seller', label: 'Car parts seller' },
// ];

// const SERVICE_TYPES = [
//   ['mechanic', 'Mechanic'], ['panel_beater', 'Panel beater'], ['rewire', 'Rewire specialist'],
//   ['auto_electrician', 'Auto electrician'], ['vulcanizer', 'Vulcanizer'], ['car_wash', 'Car wash'],
//   ['detailer', 'Detailer'], ['upholsterer', 'Upholsterer'], ['ac_specialist', 'AC specialist'], ['other', 'Other'],
// ];
// const PART_TYPES = [
//   ['new-parts', 'New parts'], ['used-parts', 'Used parts'], ['both', 'New and used'], ['all', 'All categories'], ['other', 'Other'],
// ];

// const input =
//   'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50';

// const Field = ({ label, error, children, className = '' }) => (
//   <label className={`block ${className}`}>
//     <span className="text-sm font-medium text-slate-700">{label}</span>
//     <div className="mt-1.5">{children}</div>
//     {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//   </label>
// );

// const AgentRegisterUser = ({ onNavigate }) => {
//   const [showPw, setShowPw] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [created, setCreated] = useState(null);
//   const {
//     register, handleSubmit, reset, watch, setValue, formState: { errors },
//   } = useForm({ defaultValues: { role: 'user' } });

//   const role = watch('role');
//   const state = watch('state');
//   const lgas = state && statesAndLgas[state] ? statesAndLgas[state] : [];
//   const isBusiness = role !== 'user';

//   // LGA belongs to a state, so clear it when the state changes
//   useEffect(() => setValue('lga', ''), [state, setValue]);

//   const onSubmit = async (v) => {
//     const payload = {
//       firstName: v.firstName.trim(),
//       lastName: v.lastName.trim(),
//       email: v.email.trim(),
//       phoneNumber: v.phoneNumber.trim(),
//       password: v.password,
//       role: v.role,
//       state: v.state,
//       lga: v.lga,
//     };
//     const biz = { businessName: v.businessName, businessAddress: v.businessAddress, state: v.state, lga: v.lga };
//     if (v.role === 'dealer') payload.dealerInfo = { ...biz, businessRegistrationNumber: v.businessRegistrationNumber };
//     if (v.role === 'service-provider') payload.serviceProviderInfo = { ...biz, type: v.businessType, phoneNumber: payload.phoneNumber };
//     if (v.role === 'carPart-seller') payload.carPartSellerInfo = { ...biz, type: v.businessType, phoneNumber: payload.phoneNumber };

//     setBusy(true);
//     try {
//       await agentApi.registerUser(payload);
//       setCreated({ email: payload.email, name: `${payload.firstName} ${payload.lastName}`, role: ROLES.find((r) => r.value === v.role).label });
//       reset({ role: v.role });
//       toast.success('Account created');
//     } catch (e) {
//       toast.error('Could not create account', { description: errMsg(e) });
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <>
//       <PageHeader
//         title="Sign up a user"
//         subtitle="Create an account for a buyer, dealer, service provider or parts seller. They count towards your earnings."
//       />

//       <div className="grid lg:grid-cols-3 gap-4 items-start">
//         <Card className="lg:col-span-2 p-6">
//           {created && (
//             <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
//               <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
//               <div className="text-sm text-emerald-900">
//                 <p className="font-semibold">{created.name} is signed up as a {created.role.toLowerCase()}.</p>
//                 <p className="mt-1">They can log in with {created.email} and the password you set. ₦100 has been added to your earnings.</p>
//                 <button onClick={() => onNavigate('users')} className="font-semibold underline underline-offset-2 mt-2">
//                   View my users
//                 </button>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <Field label="Account type" error={errors.role?.message}>
//               <select className={input} {...register('role', { required: 'Choose a type' })}>
//                 {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
//               </select>
//             </Field>

//             <div className="grid sm:grid-cols-2 gap-4">
//               <Field label="First name" error={errors.firstName?.message}>
//                 <input className={input} {...register('firstName', { required: 'Required' })} />
//               </Field>
//               <Field label="Last name" error={errors.lastName?.message}>
//                 <input className={input} {...register('lastName', { required: 'Required' })} />
//               </Field>
//               <Field label="Email" error={errors.email?.message}>
//                 <input type="email" className={input} {...register('email', {  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
//               </Field>
//               <Field label="Phone number" error={errors.phoneNumber?.message}>
//                 <input
//                   type="tel" placeholder="+2348012345678" className={input}
//                   {...register('phoneNumber', { required: 'Required', pattern: { value: /^\+?[0-9]{10,15}$/, message: '10–15 digits, no spaces' } })}
//                 />
//               </Field>
//             </div>

//             {isBusiness && (
//               <div className="grid sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
//                 {role !== 'dealer' && (
//                   <Field label={role === 'service-provider' ? 'Service type' : 'Parts type'} error={errors.businessType?.message}>
//                     <select className={input} {...register('businessType', { required: 'Required' })}>
//                       <option value="">Select</option>
//                       {(role === 'service-provider' ? SERVICE_TYPES : PART_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//                     </select>
//                   </Field>
//                 )}
//                 <Field label="Business name" error={errors.businessName?.message}>
//                   <input className={input} {...register('businessName', )} />
//                 </Field>
//                 {role === 'dealer' && (
//                   <Field label="Business registration number" error={errors.businessRegistrationNumber?.message}>
//                     <input className={input} placeholder="RC1234567" {...register('businessRegistrationNumber', )} />
//                   </Field>
//                 )}
//                 <Field
//                   label="Business address"
//                   error={errors.businessAddress?.message}
                  
//                 >
//                   <input className={input} {...register('businessAddress', { required: role !== 'service-provider' && 'Required' })} />
//                 </Field>
//               </div>
//             )}

//             <div className="grid sm:grid-cols-2 gap-4">
//               <Field label="State" error={errors.state?.message}>
//                 <select className={input} {...register('state', { required: 'Required' })}>
//                   <option value="">Select state</option>
//                   {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </Field>
//               <Field label="LGA" error={errors.lga?.message}>
//                 <select className={input} disabled={!state} {...register('lga', { required: 'Required' })}>
//                   <option value="">{state ? 'Select LGA' : 'Select state first'}</option>
//                   {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
//                 </select>
//               </Field>
//             </div>

//             <Field label="Temporary password" error={errors.password?.message}>
//               <div className="relative">
//                 <input
//                   type={showPw ? 'text' : 'password'}
//                   className={`${input} pr-10`}
//                   {...register('password', {
//                     required: 'Required',
//                     minLength: { value: 8, message: 'At least 8 characters' },
//                     validate: (v) =>
//                       (/[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v)) ||
//                       'Use uppercase, lowercase, a number and a symbol',
//                   })}
//                 />
//                 <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600" tabIndex={-1}>
//                   {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </Field>

//             <button
//               type="submit" disabled={busy}
//               className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5"
//             >
//               {busy && <Loader2 className="h-4 w-4 animate-spin" />}
//               Create account
//             </button>
//           </form>
//         </Card>

//         <Card className="p-6 text-sm text-slate-600 space-y-3">
//           <p className="font-semibold text-slate-900">How you earn</p>
//           <p><span className="font-semibold text-slate-800">₦100</span> as soon as the account is created.</p>
//           <p><span className="font-semibold text-slate-800">₦900</span> the first time the user starts using their account, such as getting a listing verified, selling a car or buying credits.</p>
//           <p className="text-slate-500">Tell the user to change their password after their first login.</p>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default AgentRegisterUser;






/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { agentApi, errMsg } from '../../../api/agentApi';
import { statesAndLgas } from '../../../utils/stateAndLga'; // same file your Register page uses
import { Card, PageHeader } from './UI';

const STATES = Object.keys(statesAndLgas);

const ROLES = [
  { value: 'user', label: 'Buyer' },
  { value: 'dealer', label: 'Car dealer' },
  { value: 'service-provider', label: 'Service provider' },
  { value: 'carPart-seller', label: 'Car parts seller' },
];

const SERVICE_TYPES = [
  ['mechanic', 'Mechanic'], ['panel_beater', 'Panel beater'], ['rewire', 'Rewire specialist'],
  ['auto_electrician', 'Auto electrician'], ['vulcanizer', 'Vulcanizer'], ['car_wash', 'Car wash'],
  ['detailer', 'Detailer'], ['upholsterer', 'Upholsterer'], ['ac_specialist', 'AC specialist'], ['other', 'Other'],
];
const PART_TYPES = [
  ['new-parts', 'New parts'], ['used-parts', 'Used parts'], ['both', 'New and used'], ['all', 'All categories'], ['other', 'Other'],
];

// text-black forces the typed/selected value to be black.
// The autofill and disabled rules stop browsers from overriding it with grey or blue.
const input =
  'w-full px-3.5 py-2.5 text-sm text-black placeholder:text-slate-400 rounded-xl border border-slate-200 bg-white ' +
  'focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ' +
  'disabled:opacity-50 disabled:text-black ' +
  '[&:-webkit-autofill]:[-webkit-text-fill-color:#000] [color-scheme:light]';

const Field = ({ label, error, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-medium text-black">{label}</span>
    <div className="mt-1.5">{children}</div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </label>
);

const AgentRegisterUser = ({ onNavigate }) => {
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);
  const {
    register, handleSubmit, reset, watch, setValue, formState: { errors },
  } = useForm({ defaultValues: { role: 'user' } });

  const role = watch('role');
  const state = watch('state');
  const lgas = state && statesAndLgas[state] ? statesAndLgas[state] : [];
  const isBusiness = role !== 'user';

  // LGA belongs to a state, so clear it when the state changes
  useEffect(() => setValue('lga', ''), [state, setValue]);

  const onSubmit = async (v) => {
    const payload = {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      phoneNumber: v.phoneNumber.trim(),
      password: v.password,
      role: v.role,
      state: v.state,
      lga: v.lga,
    };
    const biz = { businessName: v.businessName, businessAddress: v.businessAddress, state: v.state, lga: v.lga };
    if (v.role === 'dealer') payload.dealerInfo = { ...biz, businessRegistrationNumber: v.businessRegistrationNumber };
    if (v.role === 'service-provider') payload.serviceProviderInfo = { ...biz, type: v.businessType, phoneNumber: payload.phoneNumber };
    if (v.role === 'carPart-seller') payload.carPartSellerInfo = { ...biz, type: v.businessType, phoneNumber: payload.phoneNumber };

    setBusy(true);
    try {
      await agentApi.registerUser(payload);
      setCreated({ email: payload.email, name: `${payload.firstName} ${payload.lastName}`, role: ROLES.find((r) => r.value === v.role).label });
      reset({ role: v.role });
      toast.success('Account created');
    } catch (e) {
      toast.error('Could not create account', { description: errMsg(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Sign up a user"
        subtitle="Create an account for a buyer, dealer, service provider or parts seller. They count towards your earnings."
      />

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        <Card className="lg:col-span-2 p-6">
          {created && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-black">
                <p className="font-semibold">{created.name} is signed up as a {created.role.toLowerCase()}.</p>
                <p className="mt-1">They can log in with {created.email} and the password you set. ₦100 has been added to your earnings.</p>
                <button onClick={() => onNavigate('users')} className="font-semibold underline underline-offset-2 mt-2">
                  View my users
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Account type" error={errors.role?.message}>
              <select className={input} {...register('role', { required: 'Choose a type' })}>
                {ROLES.map((r) => <option key={r.value} value={r.value} className="text-black">{r.label}</option>)}
              </select>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" error={errors.firstName?.message}>
                <input className={input} {...register('firstName', { required: 'Required' })} />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <input className={input} {...register('lastName', { required: 'Required' })} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" className={input} {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              </Field>
              <Field label="Phone number" error={errors.phoneNumber?.message}>
                <input
                  type="tel" placeholder="+2348012345678" className={input}
                  {...register('phoneNumber', { required: 'Required', pattern: { value: /^\+?[0-9]{10,15}$/, message: '10–15 digits, no spaces' } })}
                />
              </Field>
            </div>

            {isBusiness && (
              <div className="grid sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                {role !== 'dealer' && (
                  <Field label={role === 'service-provider' ? 'Service type' : 'Parts type'} error={errors.businessType?.message}>
                    <select className={input} {...register('businessType', { required: 'Required' })}>
                      <option value="" className="text-black">Select</option>
                      {(role === 'service-provider' ? SERVICE_TYPES : PART_TYPES).map(([v, l]) => (
                        <option key={v} value={v} className="text-black">{l}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Business name" error={errors.businessName?.message}>
                  <input className={input} {...register('businessName')} />
                </Field>
                {role === 'dealer' && (
                  <Field label="Business registration number" error={errors.businessRegistrationNumber?.message}>
                    <input className={input} placeholder="RC1234567" {...register('businessRegistrationNumber')} />
                  </Field>
                )}
                <Field label="Business address" error={errors.businessAddress?.message}>
                  <input className={input} {...register('businessAddress', { required: role !== 'service-provider' && 'Required' })} />
                </Field>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="State" error={errors.state?.message}>
                <select className={input} {...register('state', { required: 'Required' })}>
                  <option value="" className="text-black">Select state</option>
                  {STATES.map((s) => <option key={s} value={s} className="text-black">{s}</option>)}
                </select>
              </Field>
              <Field label="LGA" error={errors.lga?.message}>
                <select className={input} disabled={!state} {...register('lga', { required: 'Required' })}>
                  <option value="" className="text-black">{state ? 'Select LGA' : 'Select state first'}</option>
                  {lgas.map((l) => <option key={l} value={l} className="text-black">{l}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Temporary password" error={errors.password?.message}>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`${input} pr-10`}
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                    validate: (v) =>
                      (/[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v)) ||
                      'Use uppercase, lowercase, a number and a symbol',
                  })}
                />
                <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-2.5 text-slate-500 hover:text-black" tabIndex={-1}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <button
              type="submit" disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>
        </Card>

        <Card className="p-6 text-sm text-black space-y-3">
          <p className="font-semibold text-black">How you earn</p>
          <p><span className="font-semibold text-black">₦100</span> as soon as the account is created.</p>
          <p><span className="font-semibold text-black">₦900</span> the first time the user starts using their account, such as getting a listing verified, selling a car or buying credits.</p>
          <p className="text-black">Tell the user to change their password after their first login.</p>
        </Card>
      </div>
    </>
  );
};

export default AgentRegisterUser;