
const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 3l7 3v5.5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </svg>
);

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* Side-view car, drawn with Tailwind fill/stroke classes so it follows the theme */
function CarIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 480 170" className={className} role="img" aria-label="Illustration of a recovered car">
      <ellipse cx="240" cy="156" rx="205" ry="9" className="fill-black/40" />
      {/* body */}
      <path
        d="M18 118c0-13 9-20 26-23l54-8c19-24 52-42 94-42h92c38 2 68 18 90 44l44 6c20 3 32 12 32 26v16c0 6-4 10-10 10H28c-6 0-10-4-10-10v-19z"
        className="fill-slate-800 stroke-slate-600"
        strokeWidth="2"
      />
      {/* windows */}
      <path d="M128 88c14-17 38-30 70-30h42v30h-112z" className="fill-sky-300/30" />
      <path d="M254 58h40c24 2 46 14 62 30H254V58z" className="fill-sky-300/30" />
      {/* door line + handle */}
      <path d="M252 60v62" className="stroke-slate-600" strokeWidth="2" />
      <rect x="262" y="96" width="22" height="4" rx="2" className="fill-slate-500" />
      {/* lights */}
      <rect x="442" y="100" width="20" height="9" rx="4" className="fill-amber-300" />
      <rect x="16" y="102" width="14" height="9" rx="4" className="fill-red-500" />
      {/* wheels */}
      <circle cx="112" cy="130" r="32" className="fill-slate-950" />
      <circle cx="112" cy="130" r="23" className="fill-slate-900 stroke-slate-500" strokeWidth="3" />
      <circle cx="112" cy="130" r="8" className="fill-slate-500" />
      <circle cx="372" cy="130" r="32" className="fill-slate-950" />
      <circle cx="372" cy="130" r="23" className="fill-slate-900 stroke-slate-500" strokeWidth="3" />
      <circle cx="372" cy="130" r="8" className="fill-slate-500" />
    </svg>
  );
}

export default function RecoveredCarsBanner({
  eyebrow = 'Vehicle recovery',
  title = 'Stolen. Found. Back on the road.',
  subtitle = 'A registered vehicle is easier to identify, easier to prove ownership of, and easier to bring home when it goes missing.',
  stats = [], // [{ value: '...', label: '...' }]
ctaLabel = 'View stolen vehicles',
ctaHref = '/vehicles/stolen',
secondaryLabel = '',
secondaryHref = '#',
  className = '',
}) {
  return (

    
    <section
      aria-label="Recovered stolen cars"
      className={`relative isolate overflow-hidden rounded-3xl bg-slate-950 text-white ring-1 ring-white/10 ${className}`}
    >
      {/* background: faint grid + tracking rings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_75%)]"
      />
      <div aria-hidden="true" className="absolute -right-24 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-amber-400/10" />
      <div aria-hidden="true" className="absolute -right-4 top-1/2 -z-10 h-[24rem] w-[24rem] -translate-y-1/2 rounded-full border border-amber-400/20" />
      <div aria-hidden="true" className="absolute right-20 top-1/2 -z-10 h-[14rem] w-[14rem] -translate-y-1/2 rounded-full border border-amber-400/30" />

      <div className="grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-14 lg:py-14">
        {/* copy */}
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 ring-1 ring-amber-400/30">
            <ShieldIcon className="h-4 w-4" />
            {eyebrow}
          </p>

          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={ctaHref}
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {ctaLabel}
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
         {secondaryLabel && (
  <a href={secondaryHref} className="inline-flex h-12 items-center rounded-xl px-5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
    {secondaryLabel}
  </a>
)}
          </div>


          {stats.length > 0 && (
            <dl className="mt-9 grid max-w-md grid-cols-2 gap-6 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">{s.label}</dt>
                  <dd className="mt-1 text-3xl font-extrabold text-amber-300">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* visual */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <CarIllustration className="relative z-10 w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />

          {/* RECOVERED stamp */}
          <div className="absolute -top-2 right-2 z-20 -rotate-6 rounded-lg border-2 border-amber-400 bg-slate-950/70 px-4 py-1.5 text-lg font-black uppercase tracking-[0.25em] text-amber-300 backdrop-blur sm:right-6 sm:text-xl">
            Recovered
          </div>

          {/* verification chip */}
          <div className="absolute -bottom-3 left-2 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl shadow-black/30 sm:left-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckIcon className="h-5 w-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-bold">Ownership verified</span>
              <span className="block text-slate-600">Chassis and engine numbers match</span>
            </span>
          </div>
        </div>
      </div>

      {/* road line */}
      <div aria-hidden="true" className="h-1.5 w-full [background-image:repeating-linear-gradient(90deg,#fbbf24_0_32px,transparent_32px_64px)] opacity-80" />
    </section>
  );
}