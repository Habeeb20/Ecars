// fixUsers.js
//
// One-off repair for: E11000 duplicate key ... email_1 dup key: { email: null }
//
// 1. Removes stored empty values (null / "") for email and phoneNumber
// 2. Checks for real duplicates, per field
// 3. Drops the old non-partial indexes and builds partial unique ones,
//    only for fields that have no duplicates
//
// Preview only (no changes):  node fixUsers.js --dry
// Real run:                   node fixUsers.js

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/user.js'; // adjust if your model lives elsewhere

const DRY_RUN = process.argv.includes('--dry');
const MONGO_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

const FIELDS = ['email', 'phoneNumber'];

const log = (...args) => console.log('[dry-run]', ...args);

const findDuplicates = (collection, field) =>
  collection
    .aggregate([
      { $match: { [field]: { $type: 'string' } } },
      { $group: { _id: `$${field}`, count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

const printIndexes = (indexes) =>
  indexes.forEach((i) =>
    console.log(
      `  ${i.name}  ${JSON.stringify(i.key)}${i.unique ? '  unique' : ''}${i.sparse ? '  sparse' : ''}${
        i.partialFilterExpression ? '  partial' : ''
      }`
    )
  );

const run = async () => {
  if (!MONGO_URI) {
    throw new Error('No Mongo connection string found. Set MONGODB_URI (or MONGO_URI) in your .env file.');
  }

  await mongoose.connect(MONGO_URI);
  const collection = User.collection;
  console.log(`Connected to database "${mongoose.connection.name}", collection "${collection.collectionName}"`);

  // ── 1. Current indexes ───────────────────────────────────────────────
  const before = await collection.indexes();
  console.log('\nCurrent indexes:');
  printIndexes(before);

  // ── 2. Clear empty stored values ─────────────────────────────────────
   // ── 2. Check duplicates per field (real string values only) ──────────
  console.log('\nChecking for duplicates...');
  const blocked = new Set();
  for (const field of FIELDS) {
    const dupes = await findDuplicates(collection, field);
    if (dupes.length === 0) {
      console.log(`  ${field}: no duplicates`);
      continue;
    }
    blocked.add(field);
    console.log(`  ${field}: ${dupes.length} duplicate value(s) found:`);
    dupes.forEach((d) => console.log(`    "${d._id}" used by ${d.count} users: ${d.ids.join(', ')}`));
  }

  // ── 3. Per field: drop old index, clean empties, build partial index ─
  console.log('\nFixing fields...');
  for (const field of FIELDS) {
    const name = `${field}_1`;
    const existing = before.find((i) => i.name === name);
    const emptyFilter = { [field]: { $in: [null, ''] } };

    if (blocked.has(field)) {
      // can't build a unique index yet, but cleaning is safe with a non-unique index
      if (!DRY_RUN) await collection.updateMany(emptyFilter, { $unset: { [field]: '' } });
      console.log(`  ${name}: skipped index (duplicates), empties cleaned`);
      continue;
    }
    if (existing?.partialFilterExpression) {
      console.log(`  ${name}: already partial, keeping it`);
      continue;
    }
    if (DRY_RUN) {
      log(`${name}: would drop, clean empty values, then create partial unique index`);
      continue;
    }
    if (existing) await collection.dropIndex(name);              // 1. drop first
    const res = await collection.updateMany(emptyFilter, { $unset: { [field]: '' } }); // 2. then clean
    await collection.createIndex(                                // 3. then rebuild
      { [field]: 1 },
      { name, unique: true, partialFilterExpression: { [field]: { $type: 'string' } } }
    );
    console.log(`  ${name}: dropped, cleaned ${res.modifiedCount} empty value(s), rebuilt as partial unique`);
  }

  // ── 4. Drop old index and build the partial one, only for safe fields ─
  console.log('\nRebuilding indexes...');
  for (const field of FIELDS) {
    const name = `${field}_1`;
    if (blocked.has(field)) {
      console.log(`  ${name}: skipped, fix the duplicates above and run again`);
      continue;
    }
    const existing = before.find((i) => i.name === name);
    if (existing?.partialFilterExpression) {
      console.log(`  ${name}: already partial, keeping it`);
      continue;
    }
    if (DRY_RUN) {
      log(`${name}: would drop (if present) and create partial unique index`);
      continue;
    }
    if (existing) await collection.dropIndex(name);
    await collection.createIndex(
      { [field]: 1 },
      { name, unique: true, partialFilterExpression: { [field]: { $type: 'string' } } }
    );
    console.log(`  ${name}: rebuilt as partial unique`);
  }

  if (DRY_RUN) return;

  const after = await collection.indexes();
  console.log('\nIndexes now:');
  printIndexes(after);
  if (blocked.size) console.log(`\nStill to do: ${[...blocked].join(', ')} (duplicates).`);
  else console.log('\nDone. Restart your API.');
};

run()
  .catch((err) => {
    console.error('\nFix failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());