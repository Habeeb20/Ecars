
import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 600,          // default 10 min
  checkperiod: 120,     // cleanup expired every 2 min
  useClones: false,     // faster if you don't modify returned objects
  maxKeys: 2000,        // safety limit – prevents memory explosion
});

export default cache;