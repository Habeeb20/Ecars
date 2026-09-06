


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { Loader2, X, Star, MapPin, BadgeCheck, ShieldCheck, Search } from 'lucide-react';

// const API_URL = 'https://backend-efixit.ereligion.ng/api/provider/providers';

// export default function ProvidersSection() {
//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProviders = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         if (data.success) {
//           setProviders(data.data);
//         } else {
//           toast.error('Failed to load providers');
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error('Network error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProviders();
//   }, []);

//   const goToProvider = (id) => {
//     setShowModal(false);
//     navigate(`/provider/${id}`);
//   };

//   const filteredProviders = providers.filter((p) => {
//     const q = search.toLowerCase();
//     const businessName = p.providerProfile?.businessName?.toLowerCase() || '';
//     const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
//     const serviceType = p.providerProfile?.serviceType?.toLowerCase() || '';
//     const state = p.state?.toLowerCase() || '';
//     return (
//       businessName.includes(q) ||
//       fullName.includes(q) ||
//       serviceType.includes(q) ||
//       state.includes(q)
//     );
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 className="animate-spin text-gray-400" size={32} />
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//           Service Providers
//         </h2>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
//         {providers.slice(0, 4).map((provider) => (
//           <ProviderCard key={provider._id} provider={provider} onClick={() => goToProvider(provider._id)} />
//         ))}
//       </div>

//       {providers.length > 4 && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-6 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-[#0B1B3E] hover:text-[#0B1B3E] dark:hover:text-white transition-colors"
//           >
//             See more providers ({providers.length - 4} more)
//           </button>
//         </div>
//       )}

//       {/* ALL PROVIDERS MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[85vh] shadow-2xl flex flex-col">
//             <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
//                 All Providers ({providers.length})
//               </h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-5 sm:p-6 pb-0 flex-shrink-0">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search by name, service, or state..."
//                   className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B1B3E]/20"
//                 />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-5 sm:p-6">
//               {filteredProviders.length === 0 ? (
//                 <p className="text-center text-gray-400 py-10">No providers match your search</p>
//               ) : (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                   {filteredProviders.map((provider) => (
//                     <ProviderCard
//                       key={provider._id}
//                       provider={provider}
//                       onClick={() => goToProvider(provider._id)}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// function ProviderCard({ provider, onClick }) {
//   const displayName = provider.providerProfile?.businessName || `${provider.firstName} ${provider.lastName}`;
//   const location = [provider.lga, provider.state].filter(Boolean).join(', ');

//   return (
//     <div
//       onClick={onClick}
//       className="group cursor-pointer rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
//     >
//       <div className="relative h-32 sm:h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden">
//         <img
//           src={
//             provider.profilePicture ||
//             `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=6366f1&color=fff&bold=true&size=128`
//           }
//           alt={displayName}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         {provider.isVerified && (
//           <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
//             <BadgeCheck size={10} /> Verified
//           </span>
//         )}
//         {provider.urgentAvailable?.isActive && (
//           <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
//             Urgent
//           </span>
//         )}
//       </div>

//       <div className="p-3">
//         <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate flex items-center gap-1">
//           {displayName}
//           {provider.isCertified && <ShieldCheck size={12} className="text-blue-600 shrink-0" />}
//         </h3>
//         <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
//           {provider.providerProfile?.serviceType || 'Service Provider'}
//         </p>

//         <div className="flex items-center justify-between mt-2">
//           {location && (
//             <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
//               <MapPin size={10} className="shrink-0" /> {location}
//             </span>
//           )}
//           {provider.averageRating > 0 && (
//             <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500 shrink-0">
//               <Star size={10} className="fill-amber-500" /> {provider.averageRating.toFixed(1)}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, X, Star, MapPin, BadgeCheck, ShieldCheck, Search } from 'lucide-react';

const API_URL = 'https://backend-efixit.ereligion.ng/api/provider/providers';

// Only these service types should appear in this section
const ALLOWED_SERVICE_TYPES = ['mechanic', 'auto repair', 'car painter', 'vulcanizer'];

// Normalize so "autoRepair", "Auto-Repair", "auto repair" etc. all match the same way
const normalize = (str = '') =>
  str.toLowerCase().replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();

const isAllowedServiceType = (serviceType) => {
  const normalized = normalize(serviceType);
  return ALLOWED_SERVICE_TYPES.some((allowed) => normalized.includes(allowed));
};

export default function ProvidersSection() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) {
          const filtered = (data.data || []).filter((p) =>
            isAllowedServiceType(p.providerProfile?.serviceType)
          );
          setProviders(filtered);
        } else {
          toast.error('Failed to load providers');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const goToProvider = (id) => {
    setShowModal(false);
    navigate(`/provider/${id}`);
  };

  const filteredProviders = providers.filter((p) => {
    const q = search.toLowerCase();
    const businessName = p.providerProfile?.businessName?.toLowerCase() || '';
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const serviceType = p.providerProfile?.serviceType?.toLowerCase() || '';
    const state = p.state?.toLowerCase() || '';
    return (
      businessName.includes(q) ||
      fullName.includes(q) ||
      serviceType.includes(q) ||
      state.includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Service Providers
        </h2>
      </div>

      {providers.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No matching service providers right now</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {providers.slice(0, 4).map((provider) => (
              <ProviderCard key={provider._id} provider={provider} onClick={() => goToProvider(provider._id)} />
            ))}
          </div>

          {providers.length > 4 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-[#0B1B3E] hover:text-[#0B1B3E] dark:hover:text-white transition-colors"
              >
                See more providers ({providers.length - 4} more)
              </button>
            </div>
          )}
        </>
      )}

      {/* ALL PROVIDERS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[85vh] shadow-2xl flex flex-col">
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                All Providers ({providers.length})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6 pb-0 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, service, or state..."
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B1B3E]/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {filteredProviders.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No providers match your search</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider._id}
                      provider={provider}
                      onClick={() => goToProvider(provider._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProviderCard({ provider, onClick }) {
  const displayName = provider.providerProfile?.businessName || `${provider.firstName} ${provider.lastName}`;
  const location = [provider.lga, provider.state].filter(Boolean).join(', ');

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative h-32 sm:h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={
            provider.profilePicture ||
            `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=6366f1&color=fff&bold=true&size=128`
          }
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {provider.isVerified && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
            <BadgeCheck size={10} /> Verified
          </span>
        )}
        {provider.urgentAvailable?.isActive && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
            Urgent
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate flex items-center gap-1">
          {displayName}
          {provider.isCertified && <ShieldCheck size={12} className="text-blue-600 shrink-0" />}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
          {provider.providerProfile?.serviceType || 'Service Provider'}
        </p>

        <div className="flex items-center justify-between mt-2">
          {location && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
              <MapPin size={10} className="shrink-0" /> {location}
            </span>
          )}
          {provider.averageRating > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500 shrink-0">
              <Star size={10} className="fill-amber-500" /> {provider.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}