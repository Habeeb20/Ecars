import { useCallback, useState } from 'react';
import { VehicleForm } from './VehicleRegForm';
import RegisterVehicleBanner, {Modal} from "./RegisterVehicle"

import RecoveredCarsBanner from './Recovered';


export default function VehicleRegistrationEntry() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      {notice && (
        <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>
      )}

      <RegisterVehicleBanner onCtaClick={() => { setNotice(''); setOpen(true); }} />

      <RecoveredCarsBanner
        ctaLabel="View recovered stolen vehicles"
        ctaHref="/vehicles/recovered"
      />

      <Modal open={open} onClose={close}>
        <VehicleForm
          onCancel={close}
          onSaved={(v) => {
            close();
            setNotice(`Registration submitted. Your reference is ${v.registrationRef}.`);
          }}
        />
      </Modal>
    </div>
  );
}