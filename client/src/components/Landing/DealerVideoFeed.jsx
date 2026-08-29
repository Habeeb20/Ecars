import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DealerVideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/dealer-videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data.videos || []))
      .finally(() => setLoading(false));
  }, []);

  const recordView = (id) => {
    fetch(`${API_BASE}/dealer-videos/${id}/view`, { method: 'PUT' }).catch(() => {});
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-14">
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
          <div className="space-y-10">
            {videos.map((v) => (
              <article key={v._id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <video
                  src={v.videoUrl}
                  poster={v.thumbnailUrl}
                  controls
                  onPlay={() => recordView(v._id)}
                  className="w-full aspect-video bg-black"
                />
                <div className="p-5">
                  <p className="font-medium text-slate-900 leading-snug">{v.title}</p>
                  {v.description && (
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{v.description}</p>
                  )}

                  <Link
                    to={`/dealers/${v.postedBy._id}`}
                    className="mt-4 flex items-center gap-2.5 pt-4 border-t border-slate-100 text-sm text-slate-600 hover:text-slate-900 transition"
                  >
                    <img
                      src={v.postedBy.avatar || v.postedBy?.profilePicture || '/default-avatar.jpg'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="font-medium">
                      {v.postedBy.dealerInfo?.businessName || `${v.postedBy.firstName} ${v.postedBy.lastName}`}
                    </span>
                    {v.postedBy.dealerInfo?.verified && (
                      <span className="text-xs text-amber-600 font-medium">✓ Verified</span>
                    )}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}