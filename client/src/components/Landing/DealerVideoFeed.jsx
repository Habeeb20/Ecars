// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// export default function DealerVideoFeed() {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${API_BASE}/dealer-videos`)
//       .then((res) => res.json())
//       .then((data) => setVideos(data.videos || []))
//       .finally(() => setLoading(false));
//   }, []);

//   const recordView = (id) => {
//     fetch(`${API_BASE}/dealer-videos/${id}/view`, { method: 'PUT' }).catch(() => {});
//   };

//   return (
//     <div className="bg-slate-50 min-h-screen">
//       <div className="max-w-xl mx-auto px-4 py-14">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">Dealer Showroom</p>
//           <h1 className="mt-3 text-4xl font-serif font-medium tracking-tight text-slate-900">
//             From the forecourt
//           </h1>
//           <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto">
//             Walkthroughs and reviews straight from verified dealers.
//           </p>
//         </div>

//         {loading ? (
//           <p className="text-sm text-slate-500 text-center py-16">Loading videos…</p>
//         ) : videos.length === 0 ? (
//           <p className="text-sm text-slate-500 text-center py-16">No dealer videos yet.</p>
//         ) : (
//           <div className="space-y-10">
//             {videos.map((v) => (
//               <article key={v._id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
//                 <video
//                   src={v.videoUrl}
//                   poster={v.thumbnailUrl}
//                   controls
//                   onPlay={() => recordView(v._id)}
//                   className="w-full aspect-video bg-black"
//                 />
//                 <div className="p-5">
//                   <p className="font-medium text-slate-900 leading-snug">{v.title}</p>
//                   {v.description && (
//                     <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{v.description}</p>
//                   )}

//                   <Link
//                     to={`/dealers/${v.postedBy._id}`}
//                     className="mt-4 flex items-center gap-2.5 pt-4 border-t border-slate-100 text-sm text-slate-600 hover:text-slate-900 transition"
//                   >
//                     <img
//                       src={v.postedBy.avatar || v.postedBy?.profilePicture || '/default-avatar.jpg'}
//                       alt=""
//                       className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
//                     />
//                     <span className="font-medium">
//                       {v.postedBy.dealerInfo?.businessName || `${v.postedBy.firstName} ${v.postedBy.lastName}`}
//                     </span>
//                     {v.postedBy.dealerInfo?.verified && (
//                       <span className="text-xs text-amber-600 font-medium">✓ Verified</span>
//                     )}
//                   </Link>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DealerVideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/dealer-videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .finally(() => setLoading(false));
  }, []);

  const recordView = (id) => {
    fetch(`${API_BASE}/dealer-videos/${id}/view`, { method: 'PUT' }).catch(() => {});
  };

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const cardWidth = card ? card.offsetWidth + 20 : 340; // width + gap
    el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">Dealer Showroom</p>
          <h1 className="mt-3 text-4xl font-serif font-medium tracking-tight text-slate-900">
            From the forecourt
          </h1>
          <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto">
            Walkthroughs and reviews straight from verified dealers.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 text-center py-16">Loading videos…</p>
        ) : videos.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-16">No dealer videos yet.</p>
        ) : (
          <div className="relative">
            {/* Nav arrows */}
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 hover:shadow-lg transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 hover:shadow-lg transition"
            >
              <ChevronRight size={18} />
            </button>

            {/* Carousel track */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {videos.map((v) => (
                <article
                  key={v._id}
                  data-card
                  className="snap-start shrink-0 w-[82%] sm:w-[380px] rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <video
                    src={v.videoUrl}
                    poster={v.thumbnailUrl}
                    controls
                    onPlay={() => recordView(v._id)}
                    className="w-full aspect-video bg-black"
                  />
                  <div className="p-5">
                    <p className="font-medium text-slate-900 leading-snug line-clamp-1">{v.title}</p>
                    {v.description && (
                      <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {v.description}
                      </p>
                    )}

                    <Link
                      to={`/dealers/${v.postedBy._id}`}
                      className="mt-4 flex items-center gap-2.5 pt-4 border-t border-slate-100 text-sm text-slate-600 hover:text-slate-900 transition"
                    >
                      <img
                        src={v.postedBy.avatar || v.postedBy?.profilePicture || '/default-avatar.jpg'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <span className="font-medium truncate">
                        {v.postedBy.dealerInfo?.businessName || `${v.postedBy.firstName} ${v.postedBy.lastName}`}
                      </span>
                      {v.postedBy.dealerInfo?.verified && (
                        <span className="text-xs text-amber-600 font-medium shrink-0">✓ Verified</span>
                      )}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}