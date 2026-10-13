// import { Link } from 'react-router-dom';
// import {
//   GraduationCap,
//   Fuel,
//   Wrench,
//   Navigation,
//   GitCompare,
//   ArrowUpRight,
//   Car,
//   Clock,
//   ShieldCheck,
//   Wallet,
// } from 'lucide-react';

// // Reusable external banner — opens a new tab, styled with a gradient + icon
// function ExternalBanner({ href, icon, title, subtitle, gradient }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${gradient}`}
//     >
//       {/* Decorative background blob */}
//       <div className="absolute -right-6 -top-6 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
//       <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

//       <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
//         {icon}
//       </div>

//       <div className="relative flex-1 min-w-0">
//         <h3 className="text-base sm:text-lg font-bold text-white truncate">{title}</h3>
//         <p className="text-xs sm:text-sm text-white/80 truncate">{subtitle}</p>
//       </div>

//       <ArrowUpRight
//         size={20}
//         className="relative shrink-0 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
//       />
//     </a>
//   );
// }

// // Internal route banner (for /compare)
// function InternalBanner({ to, icon, title, subtitle, gradient }) {
//   return (
//     <Link
//       to={to}
//       className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${gradient}`}
//     >
//       <div className="absolute -right-6 -top-6 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
//       <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

//       <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
//         {icon}
//       </div>

//       <div className="relative flex-1 min-w-0">
//         <h3 className="text-base sm:text-lg font-bold text-white truncate">{title}</h3>
//         <p className="text-xs sm:text-sm text-white/80 truncate">{subtitle}</p>
//       </div>

//       <ArrowUpRight
//         size={20}
//         className="relative shrink-0 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
//       />
//     </Link>
//   );
// }

// export default function PromoBanners() {
//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
//       <div className="mb-8 text-center">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
//           Everything You Need, In One Place
//         </h2>
//         <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
//           Explore trusted services across our partner network
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
//         <ExternalBanner
//           href="https://edirect.ng/business"
//           icon={<GraduationCap size={26} className="text-white" />}
//           title="Driving Schools"
//           subtitle="Find certified driving schools near you"
//           gradient="bg-gradient-to-br from-indigo-600 to-blue-700"
//         />

//         <ExternalBanner
//           href="https://edirect.ng/business"
//           icon={<Fuel size={26} className="text-white" />}
//           title="Petrol Stations"
//           subtitle="Locate fuel stations across Nigeria"
//           gradient="bg-gradient-to-br from-amber-500 to-orange-600"
//         />

//         <ExternalBanner
//           href="https://efixit.ng/providers/category/vulcanizer"
//         //   href="https://backend-efixit.ereligion.ng/api/provider/providers?category=vulcanizer"
//           icon={<Wrench size={26} className="text-white" />}
//           title="Vulcanizers"
//           subtitle="Tyre repair experts close to you"
//           gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
//         />

//         <ExternalBanner
//           href="https://edrive.ng"
//           icon={<Navigation size={26} className="text-white" />}
//           title="Book a Ride"
//           subtitle="Get moving instantly with eRide"
//           gradient="bg-gradient-to-br from-rose-600 to-pink-700"
//         />

//         <InternalBanner
//           to="/compare"
//           icon={<GitCompare size={26} className="text-white" />}
//           title="Compare Vehicles"
//           subtitle="Compare specs, prices, and features side by side"
//           gradient="bg-gradient-to-br from-violet-600 to-purple-700"
//         />
//         <InternalBanner
//           to="https://edrivers.ng"
//           icon={<GitCompare size={26} className="text-white" />}
//           title="Find a driver"
//           subtitle="Compare specs, prices, and features side by side"
//           gradient="bg-gradient-to-br from-cyan-600 to-cyan-900"
//         />
//       </div>
//     </section>
//   );
// }

// // ============================================================
// // Drivers section — richer info block, not a simple banner
// // Assumption: CTA routes to eRide, since it's the drivers-facing
// // product. Swap `driversLink` if you meant something else.
// // ============================================================

// export function DriversSection() {
//   const driversLink = 'https://edrivers.ng';

//   const perks = [
//     {
//       icon: <Wallet size={20} className="text-white" />,
//       title: 'Earn on your schedule',
//       desc: 'Drive when it suits you and get paid weekly.',
//     },
//     {
//       icon: <ShieldCheck size={20} className="text-white" />,
//       title: 'Verified & insured',
//       desc: 'Every trip is backed by rider verification and cover.',
//     },
//     {
//       icon: <Clock size={20} className="text-white" />,
//       title: 'Flexible hours',
//       desc: 'No fixed shifts — log on and off whenever you like.',
//     },
//   ];

//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1B3E] to-[#16255C] p-6 sm:p-10 lg:p-12">
//         {/* Decorative blobs */}
//         <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white/5" />
//         <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full bg-white/5" />

//         <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Left: copy + perks */}
//           <div>
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-4">
//               <Car size={13} /> For Drivers
//             </span>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
//               Turn your car into an income
//             </h2>
//             <p className="text-sm sm:text-base text-white/70 mb-6 max-w-md">
//               Join thousands of drivers earning on their own terms. Sign up in minutes
//               and start accepting rides today.
//             </p>

//             <div className="space-y-4 mb-8">
//               {perks.map((perk) => (
//                 <div key={perk.title} className="flex items-start gap-3">
//                   <div className="shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
//                     {perk.icon}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-white">{perk.title}</p>
//                     <p className="text-xs text-white/60">{perk.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
// <a
            
//               href={driversLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0B1B3E] font-bold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
//             >
//               Become a driver
//               <ArrowUpRight size={18} />
//             </a>
//           </div>

//           {/* Right: simple visual stat card */}
//           <div className="hidden lg:flex justify-center">
//             <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm border border-white/10">
//               <div className="grid grid-cols-2 gap-6 text-center">
//                 <div>
//                   <p className="text-3xl font-bold text-white">10k+</p>
//                   <p className="text-xs text-white/60 mt-1">Active drivers</p>
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">24/7</p>
//                   <p className="text-xs text-white/60 mt-1">Ride availability</p>
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">36</p>
//                   <p className="text-xs text-white/60 mt-1">States covered</p>
//                 </div>
//                 <div>
//                   <p className="text-3xl font-bold text-white">4.8★</p>
//                   <p className="text-xs text-white/60 mt-1">Avg. driver rating</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }












import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Fuel,
  Wrench,
  Navigation,
  GitCompare,
  ArrowUpRight,
  Car,
  Clock,
  ShieldCheck,
  Wallet,
  Gavel,
  Cog,
  Hammer,
  UserCheck,
} from 'lucide-react';

// One reusable banner. Pass `to` for internal routes, `href` for external links.
// Mobile: compact stacked card (icon on top) so two fit side by side.
// sm and up: horizontal layout (icon left, text, arrow right).
function Banner({ href, to, icon, title, subtitle, gradient }) {
  const className = `group relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${gradient}`;

  const content = (
    <>
      {/* Decorative background blobs */}
      <div className="absolute -right-6 -top-6 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
        {icon}
      </div>

      <div className="relative flex-1 min-w-0 w-full">
        <h3 className="text-sm sm:text-lg font-bold text-white sm:truncate">{title}</h3>
        <p className="text-[11px] leading-snug sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-none sm:truncate mt-0.5 sm:mt-0">
          {subtitle}
        </p>
      </div>

      <ArrowUpRight
        size={20}
        className="absolute top-4 right-4 sm:static shrink-0 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

export default function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Everything You Need, In One Place
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
          Explore trusted services across our partner network
        </p>
      </div>

      {/* 2 columns on mobile, 2 on sm, 3 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <Banner
          href="https://edirect.ng/category/driving-schools"
          icon={<GraduationCap size={26} className="text-white" />}
          title="Driving Schools"
          subtitle="Find certified driving schools near you"
          gradient="bg-gradient-to-br from-indigo-600 to-blue-700"
        />

        <Banner
          href="https://edirect.ng/category/Petroleum-distribution"
          icon={<Fuel size={26} className="text-white" />}
          title="Petrol Stations"
          subtitle="Locate fuel stations across Nigeria"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />

        <Banner
          href="https://efixit.ng/providers/category/vulcanizer"
          icon={<Wrench size={26} className="text-white" />}
          title="Vulcanizers"
          subtitle="Tyre repair experts close to you"
          gradient="bg-gradient-to-br from-emerald-600 to-teal-700"
        />

        <Banner
          href="https://edrive.ng"
          icon={<Navigation size={26} className="text-white" />}
          title="Book a Ride"
          subtitle="Get moving instantly with eRide"
          gradient="bg-gradient-to-br from-rose-600 to-pink-700"
        />

        <Banner
          to="/compare"
          icon={<GitCompare size={26} className="text-white" />}
          title="Compare Vehicles"
          subtitle="Compare specs, prices, and features side by side"
          gradient="bg-gradient-to-br from-violet-600 to-purple-700"
        />

        <Banner
          href="https://edrivers.ng"
          icon={<UserCheck size={26} className="text-white" />}
          title="Find a Driver"
          subtitle="Hire trusted, verified drivers on demand"
          gradient="bg-gradient-to-br from-cyan-600 to-cyan-900"
        />

        {/* New banners */}
        <Banner
          href="https://eauction.ng"
          icon={<Gavel size={26} className="text-white" />}
          title="Auctions"
          subtitle="Bid on vehicles and win great deals"
          gradient="bg-gradient-to-br from-yellow-500 to-amber-700"
        />

        <Banner
          href="https://estores.ng/category/automotive"
          icon={<Cog size={26} className="text-white" />}
          title="Vehicle Parts"
          subtitle="Genuine auto parts and accessories"
          gradient="bg-gradient-to-br from-slate-600 to-slate-800"
        />

        <Banner
          href="https://efixit.ng/repairers?category=Car%20Repair"
          icon={<Hammer size={26} className="text-white" />}
          title="Services & Repairs"
          subtitle="Book trusted mechanics and auto services"
          gradient="bg-gradient-to-br from-fuchsia-600 to-pink-800"
        />
      </div>
    </section>
  );
}





export function DriversSection() {
  const driversLink = 'https://edrivers.ng';

  const perks = [
    {
      icon: <Wallet size={20} className="text-white" />,
      title: 'Earn on your schedule',
      desc: 'Drive when it suits you and get paid weekly.',
    },
    {
      icon: <ShieldCheck size={20} className="text-white" />,
      title: 'Verified & insured',
      desc: 'Every trip is backed by rider verification and cover.',
    },
    {
      icon: <Clock size={20} className="text-white" />,
      title: 'Flexible hours',
      desc: 'No fixed shifts — log on and off whenever you like.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1B3E] to-[#16255C] p-6 sm:p-10 lg:p-12">
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: copy + perks */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-4">
              <Car size={13} /> For Drivers
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Turn your car into an income
            </h2>
            <p className="text-sm sm:text-base text-white/70 mb-6 max-w-md">
              Join thousands of drivers earning on their own terms. Sign up in minutes
              and start accepting rides today.
            </p>

            <div className="space-y-4 mb-8">
              {perks.map((perk) => (
                <div key={perk.title} className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    {perk.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{perk.title}</p>
                    <p className="text-xs text-white/60">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
<a
            
              href={driversLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0B1B3E] font-bold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Become a driver
              <ArrowUpRight size={18} />
            </a>
          </div>

          {/* Right: simple visual stat card */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-sm border border-white/10">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-xs text-white/60 mt-1">Active drivers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-xs text-white/60 mt-1">Ride availability</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">36</p>
                  <p className="text-xs text-white/60 mt-1">States covered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">4.8★</p>
                  <p className="text-xs text-white/60 mt-1">Avg. driver rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
