// utils/carSlug.js

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Builds e.g. "toyota-camry-2020-64f1e2a3b4c5d6e7f8091011"
// The FULL 24-char Mongo ObjectId is embedded at the end (not truncated),
// so extractIdFromSlug() below can always pull out a valid, lookup-able id.
export function buildCarSlug(car) {
  const parts = [car.make, car.model, car.year].filter(Boolean).map(slugify).filter(Boolean);
  const id = car._id ? String(car._id) : '';
  return [...parts, id].filter(Boolean).join('-');
}

export function buildCarUrl(car) {
  return `${window.location.origin}/cars/${buildCarSlug(car)}`;
}

// A Mongo ObjectId is exactly 24 hex characters. Since it's always the last
// segment we appended, we can pull it straight off the end of the slug
// regardless of how many words make/model contributed before it.
export function extractIdFromSlug(slug = '') {
  const match = String(slug).match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}