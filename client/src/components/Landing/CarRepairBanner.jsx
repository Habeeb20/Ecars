// components/CarRepairBanner.jsx
import {
  Wrench,
  Cog,
  ShieldCheck,
  Clock,
  BadgeCheck,
  MapPin,
  Star,
  ArrowUpRight,
  Car,
} from 'lucide-react';

const REPAIR_URL = 'https://efixit.ng/repairers?type=Car+Repair';

const perks = [
  { icon: BadgeCheck, label: 'Verified mechanics' },
  { icon: Clock, label: 'Fast turnaround' },
  { icon: ShieldCheck, label: 'Trusted & reliable' },
  { icon: MapPin, label: 'Close to you' },
];

const services = ['Engine', 'Brakes', 'AC & Cooling', 'Electrical', 'Suspension', 'Servicing'];

export default function CarRepairBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1B3E] via-[#13255a] to-[#1b2f78] shadow-xl">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-12 top-12 h-12 w-12 rounded-full border border-white/10" />

        {/* Faint spinning cog, purely decorative */}
        <Cog
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 sm:h-72 sm:w-72 text-white/5 animate-[spin_30s_linear_infinite]"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center p-6 sm:p-10 lg:p-12">
          {/* Left: copy + CTA */}
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300 ring-1 ring-orange-400/30 mb-4">
              <Wrench size={13} />
              Car Repair
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Car acting up?{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Get it fixed fast.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm sm:text-base text-white/70">
              Find trusted mechanics and auto repair experts near you. Compare providers,
              check their details, and book the right fix without the stress.
            </p>

            {/* Perks: 2x2 on mobile, 4 across on larger screens */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {perks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <Icon size={16} className="shrink-0 text-orange-300" />
                  <span className="text-[11px] sm:text-xs font-medium text-white/90 leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <a
                href={REPAIR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
              >
                Find a mechanic
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-white/60">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>Rated by drivers like you</span>
              </div>
            </div>
          </div>

          {/* Right: visual card */}
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl bg-white/10 p-5 sm:p-6 ring-1 ring-white/15 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                  <Car size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">What can we help fix?</p>
                  <p className="text-xs text-white/60">Popular repair services</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <a
                    key={s}
                    href={REPAIR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 transition-colors hover:bg-orange-500/80 hover:text-white"
                  >
                    {s}
                  </a>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-black/20 px-4 py-3">
                <ShieldCheck size={18} className="shrink-0 text-emerald-400" />
                <p className="text-xs text-white/80">
                  Browse verified repairers and pick the one that fits your car and budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}