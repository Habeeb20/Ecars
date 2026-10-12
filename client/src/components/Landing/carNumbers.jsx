

// // components/StatsSection.jsx
// import { useState, useEffect } from 'react';
// import { Car, Users, Shield, TrendingUp } from 'lucide-react';
// import { toast } from 'sonner';

// const StatsSection = () => {
//   const [stats, setStats] = useState({
//     totalCars: 0,
//     totalDealers: 0,
//     totalServiceProviders: 0,
//     totalUsers: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats/platform`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         setStats({
//           totalCars: data.data.totalCars || 0,
//           totalDealers: data.data.totalDealers || 0,
//           totalServiceProviders: data.data.totalServiceProviders || 0,
//           totalUsers: data.data.totalUsers || 0,
//         });
//       } else {
//         toast.error('Failed to load stats');
//       }
//     } catch (err) {
//       console.error('Stats fetch error:', err);
//       // Optional: fallback to cached or dummy data
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statsArray = [
//     {
//       icon: Car,
//       label: 'Available Cars',
//       value: stats.totalCars,
//       color: 'text-blue-600 dark:text-blue-400',
//     },
//     {
//       icon: Users,
//       label: 'Total Users',
//       value: stats.totalUsers,
//       color: 'text-green-600 dark:text-green-400',
//     },
//     {
//       icon: Shield,
//       label: 'Verified Dealers',
//       value: stats.totalDealers,
//       color: 'text-blue-600 dark:text-blue-400',
//     },
//     {
//       icon: TrendingUp,
//       label: 'Service Providers',
//       value: stats.totalServiceProviders,
//       color: 'text-orange-600 dark:text-orange-400',
//     },
//   ];

//   return (
//     <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
//       <div className="container mx-auto px-4">
// <div className="text-center mb-12 sm:mb-16">
//   <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
//     eCars in Numbers
//   </h2>
//   <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
//     Trusted by thousands across Nigeria
//   </p>
// </div>

//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           {statsArray.map((stat, index) => (
//             <div
//               key={index}
//               className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 p-4 sm:p-8 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 dark:from-indigo-500/20 dark:to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />

//               <div className="relative z-10 text-center">
//                 <div className="mx-auto w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 transition-transform">
//                   <stat.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.color}`} />
//                 </div>

//                 <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-3 text-gray-900 dark:text-white">
//                   {loading ? (
//                     <span className="inline-block animate-pulse">...</span>
//                   ) : (
//                     <span className="inline-block">
//                       {stat.value.toLocaleString()}
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-xs sm:text-lg text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center gap-1.5 sm:gap-2">
//                   <stat.icon className={`hidden sm:inline h-5 w-5 ${stat.color} opacity-70`} />
//                   {stat.label}
//                 </p>
//               </div>

//               <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsSection;



// components/StatsSection.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Car, Users, Shield, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalDealers: 0,
    totalServiceProviders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Carousel state (mobile only)
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats/platform`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === 'success') {
        setStats({
          totalCars: data.data.totalCars || 0,
          totalDealers: data.data.totalDealers || 0,
          totalServiceProviders: data.data.totalServiceProviders || 0,
          totalUsers: data.data.totalUsers || 0,
        });
      } else {
        toast.error('Failed to load stats');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      // Optional: fallback to cached or dummy data
    } finally {
      setLoading(false);
    }
  };

  // Work out whether the left/right buttons should be enabled
  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  // Scroll by exactly one card (card width + gap)
  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const statsArray = [
    {
      icon: Car,
      label: 'Available Cars',
      value: stats.totalCars,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Shield,
      label: 'Verified Dealers',
      value: stats.totalDealers,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: TrendingUp,
      label: 'Service Providers',
      value: stats.totalServiceProviders,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const arrowBtn =
    'sm:hidden absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 active:scale-95 transition disabled:opacity-0 disabled:pointer-events-none';

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            eCars in Numbers
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
            Trusted by thousands across Nigeria
          </p>
        </div>

        <div className="relative">
          {/* Left button (mobile only) */}
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className={`${arrowBtn} -left-3`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right button (mobile only) */}
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className={`${arrowBtn} -right-3`}
          >
            <ChevronRight size={18} />
          </button>

          {/* Mobile: horizontal carousel (3 visible). sm+: normal grid */}
          <div
            ref={scrollerRef}
            onScroll={updateScrollState}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:py-0"
          >
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden snap-start shrink-0 basis-[calc((100%-1.5rem)/3)] sm:basis-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 p-3 sm:p-8 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 dark:from-indigo-500/20 dark:to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 text-center">
                  <div className="mx-auto w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 transition-transform">
                    <stat.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${stat.color}`} />
                  </div>

                  <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-3 text-gray-900 dark:text-white">
                    {loading ? (
                      <span className="inline-block animate-pulse">...</span>
                    ) : (
                      <span className="inline-block">
                        {stat.value.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] leading-tight sm:text-lg text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center gap-1.5 sm:gap-2">
                    <stat.icon className={`hidden sm:inline h-5 w-5 ${stat.color} opacity-70`} />
                    {stat.label}
                  </p>
                </div>

                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;