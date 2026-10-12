import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../../lib/api';

import { uploadDocument } from '../../utils/uploadDocument';
/**
 * Vehicle registration: a form to register a vehicle, plus the user's own registrations
 * (status, edit while pending/rejected, withdraw).
 * Backend: GET/POST /vehicles, PATCH/DELETE /vehicles/:id
 * Colours use stock Tailwind (blue/gray); swap "blue" for your brand colour.
 */

const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];
const VEHICLE_TYPES = ['car', 'suv', 'van', 'pickup', 'bus', 'truck', 'motorcycle', 'tricycle', 'other'];
const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric', 'hybrid'];
const DOC_TYPES = [
  { id: 'proof_of_ownership', label: 'Proof of ownership / bill of sale' },
  { id: 'vehicle_license', label: 'Vehicle licence' },
  { id: 'customs_papers', label: 'Customs papers' },
  { id: 'insurance', label: 'Insurance certificate' },
  { id: 'roadworthiness', label: 'Roadworthiness certificate' },
  { id: 'owner_id', label: "Owner's ID" },
  { id: 'other', label: 'Other' },
];
const docLabel = (id) => DOC_TYPES.find((d) => d.id === id)?.label || id;
const MAX_DOCS = 10;

const STATUS = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800' },
  under_review: { label: 'Under review', cls: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

const input = 'h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';
const btn = 'inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50';
const ghost = 'inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50';
const getErrorMessage = (e) =>
  e?.response?.data?.message || e?.message || 'Something went wrong';
const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
  </label>
);
const Section = ({ title, children }) => (
  <fieldset className="space-y-3">
    <legend className="mb-1 text-base font-semibold text-gray-900">{title}</legend>
    {children}
  </fieldset>
);
const Message = ({ type, children }) =>
  children ? (
    <p role={type === 'error' ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm ${type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{children}</p>
  ) : null;

// Works whether the helper returns the body ({ success, data }) or the payload itself
const payload = (r) => {
  let d = r?.data ?? r;
  if (d && !Array.isArray(d) && typeof d === 'object' && 'success' in d && 'data' in d) d = d.data;
  return d;
};
const toList = (r) => {
  const d = payload(r);
  return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
};

/* ------------------------------ documents uploader ------------------------------ */
function DocumentUploader({ value, onChange, onBusyChange }) {
  const [type, setType] = useState('proof_of_ownership');
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const latest = useRef(value);
  latest.current = value;

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setError('');
    const room = MAX_DOCS - latest.current.length;
    if (room <= 0) return setError(`You can upload at most ${MAX_DOCS} documents`);
    const batch = files.slice(0, room);
    if (files.length > room) setError(`Only the first ${room} file(s) were added (max ${MAX_DOCS})`);

    setUploading((n) => n + batch.length);
    onBusyChange?.(true);
    const results = await Promise.allSettled(batch.map((f) => uploadDocument(f)));
    const added = results.filter((r) => r.status === 'fulfilled').map((r) => ({ type, ...r.value }));
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length) setError(`${failed.length} file(s) failed: ${failed[0].reason?.message || 'Upload failed'}`);
    onChange([...latest.current, ...added]);
    setUploading((n) => {
      const next = Math.max(0, n - batch.length);
      if (next === 0) onBusyChange?.(false);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <Message type="error">{error}</Message>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Document type">
          <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
            {DOC_TYPES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </Field>
        <label className={`${ghost} cursor-pointer ${value.length + uploading >= MAX_DOCS ? 'pointer-events-none opacity-50' : ''}`}>
          {uploading ? 'Uploading…' : 'Choose file(s)'}
          <input type="file" multiple accept="image/*,application/pdf" onChange={pick} className="hidden" />
        </label>
      </div>
      <p className="text-xs text-gray-500">Images or PDF, up to 10MB each. Pick the type first, then choose the file. You can upload each type separately.</p>
      {value.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-xl bg-gray-50 text-sm">
          {value.map((d, i) => (
            <li key={d.url} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate font-medium text-gray-900">{docLabel(d.type)}</span>
                <a href={d.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-blue-700 underline">{d.name || 'View file'}</a>
              </span>
              <button type="button" className="shrink-0 text-red-700" onClick={() => onChange(value.filter((_, n) => n !== i))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ form ------------------------------ */
const blank = () => ({
  ownerName: '', phone: '', address: '', state: '',
  vehicleType: 'car', make: '', model: '', year: '', color: '', usage: 'private', fuelType: '',
  plateNumber: '', plateState: '', preferredPlateNumber: '',
  chassisNumber: '', engineNumber: '', documents: [],
});
const fromVehicle = (v) => {
  const b = blank();
  Object.keys(b).forEach((k) => { if (v[k] !== undefined && v[k] !== null) b[k] = v[k]; });
  return b;
};
const upper = (v) => v.toUpperCase().replace(/\s+/g, '');

export function VehicleForm({ initial, onSaved, onCancel }) {
  const [f, setF] = useState(initial ? fromVehicle(initial) : blank());
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, transform) => (e) => setF((x) => ({ ...x, [k]: transform ? transform(e.target.value) : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    setError('');
    if (f.documents.length === 0) return setError('Upload at least one vehicle document.');
    if (f.plateNumber && !f.plateState) return setError('Choose the state your current plate was issued in.');
    setBusy(true);
    try {
      const body = { ...f, year: Number(f.year) };
      const r = initial ? await api.patch(`/vehicles/${initial._id}`, body) : await api.post('/vehicles', body);
      onSaved(payload(r), !!initial);
    } catch (err) { setError(getErrorMessage(err)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl bg-white p-5 ring-1 ring-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{initial ? `Edit registration ${initial.registrationRef}` : 'Register a vehicle'}</h2>
      <Message type="error">{error}</Message>

      <Section title="Owner details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name of owner *"><input required className={input} value={f.ownerName} onChange={set('ownerName')} autoComplete="name" /></Field>
          <Field label="Phone number *"><input required type="tel" inputMode="tel" className={input} value={f.phone} onChange={set('phone')} placeholder="08012345678" autoComplete="tel" /></Field>
          <Field label="State of residence *">
            <select required className={input} value={f.state} onChange={set('state')}>
              <option value="">Select state</option>
              {NG_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Address *"><input required className={input} value={f.address} onChange={set('address')} autoComplete="street-address" /></Field>
        </div>
      </Section>

      <Section title="Vehicle details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Vehicle type *">
            <select required className={`${input} capitalize`} value={f.vehicleType} onChange={set('vehicleType')}>
              {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Make *"><input required className={input} value={f.make} onChange={set('make')} placeholder="Toyota" /></Field>
          <Field label="Model *"><input required className={input} value={f.model} onChange={set('model')} placeholder="Camry" /></Field>
          <Field label="Year *"><input required inputMode="numeric" maxLength={4} className={input} value={f.year} onChange={set('year')} placeholder="2018" /></Field>
          <Field label="Colour *"><input required className={input} value={f.color} onChange={set('color')} /></Field>
          <Field label="Fuel type">
            <select className={`${input} capitalize`} value={f.fuelType} onChange={set('fuelType')}>
              <option value="">Not specified</option>
              {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Usage *">
            <select className={`${input} capitalize`} value={f.usage} onChange={set('usage')}>
              <option value="private">Private</option>
              <option value="commercial">Commercial</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Number plate">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Current vehicle (plate) number" hint="Leave empty if the vehicle has no plate yet">
            <input className={`${input} uppercase`} value={f.plateNumber} onChange={set('plateNumber', upper)} placeholder="ABC123XY" />
          </Field>
          <Field label="State of number plate" hint="State the current plate was issued in">
            <select className={input} value={f.plateState} onChange={set('plateState')} disabled={!f.plateNumber}>
              <option value="">Select state</option>
              {NG_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Preferred number plate" hint="The plate you would like, if you want a custom one">
            <input className={`${input} uppercase`} value={f.preferredPlateNumber} onChange={set('preferredPlateNumber', upper)} />
          </Field>
        </div>
      </Section>

      <Section title="Identification numbers">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Chassis number *" hint="Found on the vehicle licence or under the windscreen">
            <input required className={`${input} uppercase`} value={f.chassisNumber} onChange={set('chassisNumber', upper)} />
          </Field>
          <Field label="Engine number *"><input required className={`${input} uppercase`} value={f.engineNumber} onChange={set('engineNumber', upper)} /></Field>
        </div>
      </Section>

      <Section title="Vehicle documents *">
        <DocumentUploader value={f.documents} onChange={(documents) => setF((x) => ({ ...x, documents }))} onBusyChange={setUploading} />
      </Section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className={ghost}>Cancel</button>}
        <button type="submit" disabled={busy || uploading} className={btn}>
          {uploading ? 'Uploading documents…' : busy ? 'Saving…' : initial ? 'Save and resubmit' : 'Submit registration'}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ my vehicles ------------------------------ */
function VehicleCard({ v, onEdit, onWithdraw }) {
  const s = STATUS[v.status] || STATUS.pending;
  const editable = v.status === 'pending' || v.status === 'rejected';
  return (
    <li className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">{v.make} {v.model} ({v.year})</h3>
          <p className="text-sm capitalize text-gray-600">{v.vehicleType} · {v.color} · {v.usage}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>{s.label}</span>
      </div>
      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {[
          ['Reference', v.registrationRef],
          ['Plate number', v.plateNumber ? `${v.plateNumber}${v.plateState ? ` (${v.plateState})` : ''}` : 'No plate yet'],
          ['Preferred plate', v.preferredPlateNumber],
          ['Chassis number', v.chassisNumber],
          ['Engine number', v.engineNumber],
          ['Documents', `${v.documents?.length || 0} uploaded`],
        ].filter(([, val]) => val).map(([k, val]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-gray-100 py-1">
            <dt className="text-gray-500">{k}</dt><dd className="text-right font-medium text-gray-900">{val}</dd>
          </div>
        ))}
      </dl>
      {v.status === 'rejected' && v.reviewNote && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">Reason: {v.reviewNote}. Edit the registration and resubmit it.</p>
      )}
      {editable && (
        <div className="flex gap-4 border-t border-gray-100 pt-3 text-sm font-medium">
          <button type="button" className="text-blue-700" onClick={() => onEdit(v)}>{v.status === 'rejected' ? 'Edit and resubmit' : 'Edit'}</button>
          <button type="button" className="text-red-700" onClick={() => onWithdraw(v)}>Withdraw</button>
        </div>
      )}
    </li>
  );
}

/* ------------------------------ page ------------------------------ */
export default function VehicleRegistrationPage({ autoOpenForm = false }) {
  const [vehicles, setVehicles] = useState(null);
  const [editing, setEditing] = useState(null);   // vehicle being edited
  const [showForm, setShowForm] = useState(autoOpenForm);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const topRef = useRef(null);

  const load = useCallback(() => {
    api.get('/vehicles').then((r) => { setVehicles(toList(r)); setError(''); }).catch((e) => setError(getErrorMessage(e)));
  }, []);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (showForm) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [showForm, editing]);

  const saved = (v, wasEdit) => {
    setShowForm(false); setEditing(null);
    setNotice(wasEdit ? `Registration ${v.registrationRef} updated.` : `Registration submitted. Your reference is ${v.registrationRef}.`);
    load();
  };

  const withdraw = async (v) => {
    if (!window.confirm(`Withdraw the registration for ${v.make} ${v.model}? This cannot be undone.`)) return;
    try { await api.delete(`/vehicles/${v._id}`); setNotice('Registration withdrawn.'); load(); }
    catch (e) { setError(getErrorMessage(e)); }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
      <div ref={topRef} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle registration</h1>
          <p className="mt-1 text-sm text-gray-600">Register your vehicle and track the status of each application.</p>
        </div>
        {!showForm && <button type="button" className={btn} onClick={() => { setNotice(''); setEditing(null); setShowForm(true); }}>Register a vehicle</button>}
      </div>

      <Message type="ok">{notice}</Message>
      <Message type="error">{error}</Message>

      {showForm && (
        <VehicleForm
          key={editing?._id || 'new'}
          initial={editing}
          onSaved={saved}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">My vehicles</h2>
        {!vehicles ? <p className="text-sm text-gray-500">Loading…</p>
          : vehicles.length === 0 ? <p className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-600">You have not registered any vehicle yet.</p>
          : (
            <ul className="space-y-3">
              {vehicles.map((v) => (
                <VehicleCard key={v._id} v={v} onEdit={(x) => { setNotice(''); setEditing(x); setShowForm(true); }} onWithdraw={withdraw} />
              ))}
            </ul>
          )}
      </section>
    </div>
  );
}