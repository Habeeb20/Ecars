import { useEffect } from 'react';

export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="my-8 w-full max-w-3xl">{children}</div>
    </div>
  );
}

export default function RegisterVehicleBanner({
  eyebrow = 'Vehicle registration',
  title = 'Register your vehicle in minutes.',
  subtitle = 'Add your chassis and engine numbers, upload your documents, and track the status of every application.',
  ctaLabel = 'Register your vehicle',
  onCtaClick,
  className = '',
}) {
  return (
    <section
      aria-label="Register a vehicle"
      className={`relative isolate overflow-hidden rounded-3xl bg-blue-600 text-white ${className}`}
    >
      <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -bottom-24 right-24 -z-10 h-64 w-64 rounded-full bg-white/5" />

      <div className="flex flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base text-blue-100">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}