// src/components/GalleryFeed.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, X, Eye, MessageSquare, ImageOff } from 'lucide-react';

const GalleryFeed = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchGallery = useCallback(async (pageNum) => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/carparts/mygallery/images?page=${pageNum}&limit=12`;
      // If your current route is still /carparts/mygallery/images, change it here:
      // const url = `${import.meta.env.VITE_BACKEND_URL}/carparts/mygallery/images?page=${pageNum}&limit=12`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setItems((prev) => [...prev, ...data.data]);
        setHasMore(pageNum < data.pagination.pages);
      } else {
        throw new Error(data.message || 'Failed to load gallery');
      }
    } catch (err) {
      setError(err.message || 'Network error');
      console.error('Gallery fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading]);

  // Initial fetch
  useEffect(() => {
    fetchGallery(1);
  }, [fetchGallery]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 400 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchGallery(nextPage);
          return nextPage;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, fetchGallery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-1xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          Gallery
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            All your cars and parts — click any image to see full details
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-center py-10 text-red-600 dark:text-red-400">
            {error} —{' '}
            <button
              onClick={() => {
                setError(null);
                fetchGallery(1);
              }}
              className="underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full object-cover rounded-t-2xl group-hover:scale-[1.04] transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex items-center justify-center rounded-t-2xl">
                  <ImageOff className="h-10 w-10 text-slate-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                <h3 className="text-white font-semibold text-base sm:text-lg leading-tight line-clamp-2 mb-1">
                  {item.title}
                </h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg sm:text-xl font-bold text-emerald-400">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <span className="text-white/80 text-xs sm:text-sm">
                    {item.type === 'car'
                      ? `${item.make || ''} ${item.model || ''} • ${item.year || ''}`
                      : item.partType?.toUpperCase() || 'Part'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {item.views || 0}
                  </span>
                  {item.type === 'part' && (
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" /> {item.inquiries || 0}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.condition?.includes('new') || item.condition === 'brand new'
                        ? 'bg-green-600/80'
                        : item.condition?.includes('used')
                        ? 'bg-amber-600/80'
                        : 'bg-blue-600/80'
                    }`}
                  >
                    {item.condition?.toUpperCase() || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* End of content */}
        {!loading && !hasMore && items.length > 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12 text-lg">
            You've seen all your uploaded items ✨
          </p>
        )}

        {items.length === 0 && !loading && !error && (
          <p className="text-center py-20 text-slate-500 dark:text-slate-400 text-xl">
            You haven't uploaded any cars or parts yet...
          </p>
        )}
      </div>

      {/* Modal - Full details */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-[80%]">
                {selectedItem.title}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* All images */}
              {selectedItem.images?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {selectedItem.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${selectedItem.title} image ${index + 1}`}
                      className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-8">
                  <ImageOff className="h-16 w-16 text-slate-400" />
                </div>
              )}

              {/* Main info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    ₦{selectedItem.price?.toLocaleString() || '—'}
                  </div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">
                    {selectedItem.type === 'car'
                      ? `${selectedItem.make || ''} ${selectedItem.model || ''} • ${selectedItem.year || '—'}`
                      : `${selectedItem.partType?.toUpperCase() || 'Part'}`}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium">
                    {selectedItem.condition?.toUpperCase() || 'Unknown'}
                  </span>
                  {selectedItem.type === 'car' && selectedItem.bodyType && (
                    <span className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium">
                      {selectedItem.bodyType}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Description</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>

              {/* Extra info for parts */}
              {selectedItem.type === 'part' && selectedItem.compatibleMakes?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                    Compatible Makes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.compatibleMakes.map((make, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {make}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Views: {selectedItem.views || 0} • Listed on{' '}
                {new Date(selectedItem.createdAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryFeed;