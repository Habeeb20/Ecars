// Same env vars as your uploadImage helper. The preset must be UNSIGNED.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ALLOWED = ['application/pdf'];

/**
 * Uploads an image or a PDF to Cloudinary (the "auto" endpoint detects the type).
 * Returns { url, name } — url is the secure URL your API expects.
 */
export async function uploadDocument(file, { maxMB = 10 } = {}) {
  if (!CLOUD || !PRESET) throw new Error('Cloudinary is not configured');
  if (!file.type.startsWith('image/') && !ALLOWED.includes(file.type)) throw new Error('Upload an image or a PDF file');
  if (file.size > maxMB * 1024 * 1024) throw new Error(`File must be smaller than ${maxMB}MB`);

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, { method: 'POST', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return { url: data.secure_url, name: file.name };
}