// utils/slugify.js
export const slugify = (text = '') => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars
    .replace(/\s+/g, '')        // collapse spaces -> nothing (habeeb dealers -> habeebdealers)
    .replace(/-+/g, '');
};

export const generateUniqueSlug = async (Model, baseName, excludeId = null) => {
  const base = slugify(baseName) || 'dealer';
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.findOne(query);
    if (!exists) return slug;
    slug = `${base}${counter}`;
    counter += 1;
  }
};
