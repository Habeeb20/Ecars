// import { useState } from 'react';
// import { toast } from 'sonner';

// const API_BASE = import.meta.env.VITE_API_BASE_URL;
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// async function uploadVideoToCloudinary(file, onProgress) {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
//     formData.append('resource_type', 'video');

//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);

//     xhr.upload.onprogress = (e) => {
//       if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
//     };
//     xhr.onload = () => {
//       const data = JSON.parse(xhr.responseText);
//       if (xhr.status >= 200 && xhr.status < 300) resolve(data);
//       else reject(new Error(data.error?.message || 'Video upload failed'));
//     };
//     xhr.onerror = () => reject(new Error('Network error during upload'));
//     xhr.send(formData);
//   });
// }

// export default function DealerVideoUploadForm({ onPosted }) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     if (!f.type.startsWith('video/')) {
//       setError('Please select a video file.');
//       return;
//     }
//     setError('');
//     setFile(f);
//     setPreviewUrl(URL.createObjectURL(f));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!file) {
//       setError('Please choose a video to upload.');
//       return;
//     }

//     try {
//       setUploading(true);
//       const cloudinaryData = await uploadVideoToCloudinary(file, setProgress);
//       setUploading(false);

//       setSubmitting(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${API_BASE}/dealer-videos`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           title,
//           description,
//           videoUrl: cloudinaryData.secure_url,
//           thumbnailUrl: cloudinaryData.secure_url.replace(/\.[^.]+$/, '.jpg'), // Cloudinary video-to-image trick
//           duration: cloudinaryData.duration,
//         }),
//       });
//       if(res.ok){
//         toast.success("video posted successfully")
//       }
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Something went wrong');

//       URL.revokeObjectURL(previewUrl);
//       setTitle(''); setDescription(''); setFile(null); setPreviewUrl(null); setProgress(0);
//       onPosted?.(data.video);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setUploading(false);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
//       <div>
//         <h2 className="text-lg font-semibold text-slate-900">Post a video</h2>
//         <p className="text-sm text-slate-500 mt-1">Show buyers around your showroom or a specific car.</p>
//       </div>

//       {previewUrl ? (
//         <div className="relative rounded-xl overflow-hidden bg-black">
//           <video src={previewUrl} controls className="w-full max-h-64" />
//           <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }}
//             className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 text-sm">
//             ×
//           </button>
//         </div>
//       ) : (
//         <label className="block rounded-xl border-2 border-dashed border-slate-300 py-10 text-center text-slate-400 hover:border-slate-400 hover:text-slate-500 cursor-pointer text-sm">
//           Click to select a video
//           <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
//         </label>
//       )}

//       <div>
//         <label className="text-sm font-medium text-slate-700">Title</label>
//         <input value={title} onChange={(e) => setTitle(e.target.value)} required
//           className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
//       </div>

//       <div>
//         <label className="text-sm font-medium text-slate-700">Description (optional)</label>
//         <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
//           className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
//       </div>

//       {uploading && (
//         <div>
//           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//             <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
//           </div>
//           <p className="text-xs text-slate-500 mt-1">Uploading video… {progress}%</p>
//         </div>
//       )}

//       {error && <p className="text-sm text-rose-600">{error}</p>}

//       <button type="submit" disabled={uploading || submitting}
//         className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
//         {uploading ? 'Uploading…' : submitting ? 'Posting…' : 'Post video'}
//       </button>
//     </form>
//   );
// }


// components/DealerVideoUploadForm.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PACK_PRICE_NGN = 5000;
const PACK_CREDITS = 10;

async function uploadVideoToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'video');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error?.message || 'Video upload failed'));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export default function DealerVideoUploadForm({ onPosted }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [videoCredits, setVideoCredits] = useState(null); // null = not loaded yet
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [buying, setBuying] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchBalance = async () => {
    try {
      setLoadingCredits(true);
      const res = await fetch(`${API_BASE}/video-credits/balance`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setVideoCredits(data.videoCredits);
    } catch {
      // non-fatal — form will just show credits as unknown/0 and let the API guard handle it
    } finally {
      setLoadingCredits(false);
    }
  };

  // On mount: load balance, and if we just came back from a Paystack redirect, verify the payment
  useEffect(() => {
    const reference = searchParams.get('ref');
    if (reference) {
      (async () => {
        try {
          setVerifyingPayment(true);
          const res = await fetch(`${API_BASE}/video-credits/verify/${reference}`, {
            headers: authHeaders(),
          });
          const data = await res.json();
          if (res.ok) {
            setVideoCredits(data.videoCredits);
            toast.success(
              data.alreadyProcessed ? 'Payment already confirmed' : `${PACK_CREDITS} video credits added`
            );
          } else {
            toast.error(data.message || 'Could not confirm payment');
          }
        } catch {
          toast.error('Could not confirm payment');
        } finally {
          setVerifyingPayment(false);
          searchParams.delete('ref');
          setSearchParams(searchParams, { replace: true });
        }
      })();
    } else {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuyCredits = async () => {
    try {
      setBuying(true);
      const res = await fetch(`${API_BASE}/video-credits/initialize`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not start payment');
      window.location.href = data.authorization_url;
    } catch (err) {
      toast.error(err.message);
      setBuying(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError('Please select a video file.');
      return;
    }
    setError('');
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setTitle('');
    setDescription('');
    setFile(null);
    setPreviewUrl(null);
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose a video to upload.');
      return;
    }
    if (videoCredits === 0) {
      setError(`You're out of video credits. Buy ${PACK_CREDITS} more for ₦${PACK_PRICE_NGN.toLocaleString()} to keep posting.`);
      return;
    }

    try {
      setUploading(true);
      const cloudinaryData = await uploadVideoToCloudinary(file, setProgress);
      setUploading(false);

      setSubmitting(true);
      const res = await fetch(`${API_BASE}/dealer-videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          title,
          description,
          videoUrl: cloudinaryData.secure_url,
          thumbnailUrl: cloudinaryData.secure_url.replace(/\.[^.]+$/, '.jpg'),
          duration: cloudinaryData.duration,
        }),
      });
      const data = await res.json();

      if (res.status === 402) {
        setVideoCredits(0);
        setError(data.message || `You're out of video credits. Buy ${PACK_CREDITS} more for ₦${PACK_PRICE_NGN.toLocaleString()}.`);
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Video posted successfully');
      if (data.videoCreditsRemaining !== undefined) setVideoCredits(data.videoCreditsRemaining);

      resetForm();
      onPosted?.(data.video);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const outOfCredits = videoCredits === 0;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Credit status banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {verifyingPayment
              ? 'Confirming payment…'
              : loadingCredits
              ? 'Loading credits…'
              : `${videoCredits ?? 0} video ${videoCredits === 1 ? 'credit' : 'credits'} left`}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            ₦{PACK_PRICE_NGN.toLocaleString()} = {PACK_CREDITS} video posts
          </p>
        </div>
        {outOfCredits && !verifyingPayment && (
          <button
            type="button"
            onClick={handleBuyCredits}
            disabled={buying}
            className="rounded-lg bg-slate-900 text-white text-sm px-4 py-2 font-medium hover:bg-slate-800 disabled:opacity-50 shrink-0"
          >
            {buying ? 'Redirecting…' : `Buy ${PACK_CREDITS} credits`}
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Post a video</h2>
          <p className="text-sm text-slate-500 mt-1">Show buyers around your showroom or a specific car.</p>
        </div>

        {previewUrl ? (
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video src={previewUrl} controls className="w-full max-h-64" />
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(previewUrl);
                setFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 text-sm"
            >
              ×
            </button>
          </div>
        ) : (
          <label
            className={`block rounded-xl border-2 border-dashed py-10 text-center text-sm cursor-pointer ${
              outOfCredits
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500'
            }`}
          >
            {outOfCredits ? 'Buy credits above to post a video' : 'Click to select a video'}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={outOfCredits}
              className="hidden"
            />
          </label>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={outOfCredits}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Description (optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={outOfCredits}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:bg-slate-50"
          />
        </div>

        {uploading && (
          <div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Uploading video… {progress}%</p>
          </div>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={uploading || submitting || outOfCredits || loadingCredits}
          className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : submitting ? 'Posting…' : outOfCredits ? 'No credits left' : 'Post video'}
        </button>
      </form>
    </div>
  );
}