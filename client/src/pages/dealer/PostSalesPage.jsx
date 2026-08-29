import { useState } from 'react';
import SaleListingForm from './SalesListingForm';
import DealerInventoryPicker from './DealerInventoryPicker';
import { useAuth } from '../../contexts/AuthContext';


export default function PostSalePage() {
  const { user } = useAuth(); // expects user.role
  const isDealer = user?.role === 'dealer';
  const [mode, setMode] = useState('new'); // 'new' | 'inventory'
  const [done, setDone] = useState(null);

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-xl font-semibold text-slate-900">Sale posted 🎉</h2>
        <p className="text-sm text-slate-500 mt-2">"{done.title}" is now live in the sales feed.</p>
        <button onClick={() => { setDone(null); setMode('new'); }}
          className="mt-6 text-sm font-medium text-slate-900 underline">
          Post another
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      {isDealer && (
        <div className="max-w-2xl mx-auto mb-6 flex gap-2">
          <TabButton active={mode === 'new'} onClick={() => setMode('new')}>New listing</TabButton>
          <TabButton active={mode === 'inventory'} onClick={() => setMode('inventory')}>From my inventory</TabButton>
        </div>
      )}

      {mode === 'new' || !isDealer
        ? <SaleListingForm onCreated={setDone} />
        : <DealerInventoryPicker onConverted={setDone} />}
    </div>
  );
}

function TabButton({ active, children, ...props }) {
  return (
    <button {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition
        ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
      {children}
    </button>
  );
}