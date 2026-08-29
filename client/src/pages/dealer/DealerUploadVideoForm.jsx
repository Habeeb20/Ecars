import { useState } from 'react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please choose a video to upload.');
      return;
    }

    try {
      setUploading(true);
      const cloudinaryData = await uploadVideoToCloudinary(file, setProgress);
      setUploading(false);

      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/dealer-videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description,
          videoUrl: cloudinaryData.secure_url,
          thumbnailUrl: cloudinaryData.secure_url.replace(/\.[^.]+$/, '.jpg'), // Cloudinary video-to-image trick
          duration: cloudinaryData.duration,
        }),
      });
      if(res.ok){
        toast.success("video posted successfully")
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      URL.revokeObjectURL(previewUrl);
      setTitle(''); setDescription(''); setFile(null); setPreviewUrl(null); setProgress(0);
      onPosted?.(data.video);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Post a video</h2>
        <p className="text-sm text-slate-500 mt-1">Show buyers around your showroom or a specific car.</p>
      </div>

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video src={previewUrl} controls className="w-full max-h-64" />
          <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 text-sm">
            ×
          </button>
        </div>
      ) : (
        <label className="block rounded-xl border-2 border-dashed border-slate-300 py-10 text-center text-slate-400 hover:border-slate-400 hover:text-slate-500 cursor-pointer text-sm">
          Click to select a video
          <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}

      <div>
        <label className="text-sm font-medium text-slate-700">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Description (optional)</label>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
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

      <button type="submit" disabled={uploading || submitting}
        className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
        {uploading ? 'Uploading…' : submitting ? 'Posting…' : 'Post video'}
      </button>
    </form>
  );
}