import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, ExternalLink, ChevronLeft, RefreshCw, AlertTriangle } from "lucide-react";

/* ---------------------------------------------------------------------
   DATA SOURCE
   Live lots are fetched from the eAuction API. The shape expected for
   each item matches what GET /auction/items returns, e.g.:
   {
     id, title, description, status, category,
     startingPrice, reservePrice, currentBid, buyNowPrice, bidIncrement,
     location, state, lga, images: [...], isFeatured, viewCount,
     approvedAt, bidTimeoutSeconds,
     auctionCategory: { name }, auctionSubCategory: { name },
     vendor: { ninVerificationStatus, state },
     vehicleDetail: { make, model, year, ... }
   }
--------------------------------------------------------------------- */

// In dev, Vite's proxy (see vite.config.js) forwards "/api/eauction/*" to
// the real eAuction API so the browser never hits it cross-origin.
// In prod, point this at your own backend's passthrough route instead —
// set VITE_BACKEND_URL and it'll call
// `${VITE_BACKEND_URL}/api/eauction/auction/items` automatically.
const ITEMS_ENDPOINT = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/eauction/auction/items`
  : "/eauction/auction/items";

// Only these auction categories should show up in the catalog.
const ALLOWED_CATEGORIES = ["CARS"];

// Clicking a lot takes the visitor straight to this public description
// page, with the lot's id appended as a query param.
const LOT_DESCRIPTION_URL = "https://eauction.ng/description";
const lotDescriptionHref = (id) => `${LOT_DESCRIPTION_URL}?id=${encodeURIComponent(id)}`;

/* ---------------------------------------------------------------------
   HELPERS
--------------------------------------------------------------------- */

const naira = (v) =>
  v === null || v === undefined || v === ""
    ? null
    : `₦${Number(v).toLocaleString("en-NG")}`;

const lotLabel = (item) => {
  const vd = item.vehicleDetail;
  if (vd) return `${vd.year} ${vd.make} ${vd.model}`;
  return item.title;
};

const STATUS_STYLE = {
  LIVE: { label: "Live", cls: "border-red-800 text-red-800" },
  ENDED: { label: "Ended", cls: "border-emerald-800 text-emerald-800" },
  SOLD: { label: "Sold", cls: "border-emerald-800 text-emerald-800" },
};

/**
 * The API might respond with a raw array, or with the payload wrapped in
 * a common envelope shape (e.g. { data: [...] } or { items: [...] }).
 * Normalize whatever comes back into a plain array of lot objects, then
 * keep only the categories this catalog cares about.
 */
function normalizeItemsResponse(payload) {
  let list = [];
  if (Array.isArray(payload)) list = payload;
  else if (Array.isArray(payload?.data)) list = payload.data;
  else if (Array.isArray(payload?.items)) list = payload.items;
  else if (Array.isArray(payload?.results)) list = payload.results;

  return list.filter((item) =>
    ALLOWED_CATEGORIES.includes(String(item?.category ?? "").toUpperCase())
  );
}

/* ---------------------------------------------------------------------
   PRESENTATIONAL PIECES
--------------------------------------------------------------------- */

function StatusStamp({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.LIVE;
  return (
    <div
      className={`absolute top-2.5 right-2.5 flex h-14 w-14 -rotate-6 items-center justify-center rounded-full border-2 bg-white/90 text-center font-serif text-[11px] font-semibold uppercase tracking-wide mix-blend-multiply ${s.cls}`}
    >
      <span>{s.label}</span>
    </div>
  );
}

function LotCard({ item }) {
  const price = naira(item.currentBid) || naira(item.startingPrice);
  const priceLabel = item.currentBid ? "Current bid" : "Starting price";

  return (
    <a
      href={lotDescriptionHref(item.id)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View details for ${lotLabel(item)} on eAuction.ng`}
      className="flex flex-col overflow-hidden rounded border border-stone-300 bg-stone-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <img src={item.images?.[0]} alt={lotLabel(item)} loading="lazy" className="h-full w-full object-cover" />
        <StatusStamp status={item.status} />
        {item.isFeatured && (
          <div className="absolute bottom-2.5 left-2.5 rounded-sm bg-amber-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </div>
        )}
      </div>

      <div
        className="flex justify-between border-y border-dashed border-stone-300 bg-gradient-to-b from-stone-200 from-50% to-stone-50 to-50% px-2"
        aria-hidden="true"
      >
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="-my-px h-1.5 w-1.5 rounded-full bg-stone-100 shadow-[0_0_0_1px_theme(colors.stone.300)]" />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] tracking-wide text-stone-400">
            LOT №{String(item.id).padStart(3, "0")}
          </span>
          <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
            {item.auctionSubCategory?.name || item.category}
          </span>
        </div>

        <h3 className="font-serif text-lg font-semibold leading-tight text-slate-800">{lotLabel(item)}</h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={13} strokeWidth={2.2} />
          <span>{item.location}, {item.state}</span>
        </div>

        <div className="mt-1.5 flex items-end justify-between border-t border-stone-300 pt-3">
          <div>
            <div className="text-[10.5px] uppercase tracking-wide text-stone-400">{priceLabel}</div>
            <div className="mt-0.5 font-mono text-base font-semibold text-slate-800">{price}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-slate-800 px-3 py-2 text-[11.5px] font-medium text-slate-800 transition-colors">
            View lot sheet
            <ExternalLink size={12} strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ---------------------------------------------------------------------
   PAGES
--------------------------------------------------------------------- */

function Header({ liveCount, onLogoClick, subtitle }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-stone-300 px-6 pb-5 pt-7">
      <div className="flex cursor-pointer items-center gap-3" onClick={onLogoClick} role="button" tabIndex={0}>
        <span className="flex h-10.5 w-10.5 items-center justify-center rounded-full border border-slate-800 bg-slate-800 font-serif text-base font-semibold text-stone-100">
          eA
        </span>
        <div>
          <div className="font-serif text-xl font-semibold leading-tight text-slate-800">
            eAuction<span className="italic text-amber-700">.ng</span>
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-slate-500">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="h-1.75 w-1.75 rounded-full bg-emerald-600 shadow-[0_0_0_3px_rgba(16,150,80,0.18)]" />
        <span className="font-mono">{liveCount} lots live now</span>
      </div>
    </header>
  );
}

function StateNotice({ icon, title, message, onRetry }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-2.5 py-14 text-center text-slate-500">
        <span className="text-red-800">{icon}</span>
        <h2 className="mt-1 font-serif text-xl text-slate-800">{title}</h2>
        <p className="mb-2 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-7 py-3.5 text-[13.5px] font-medium text-stone-100 transition-all hover:-translate-y-0.5 hover:bg-amber-800"
          >
            <RefreshCw size={14} strokeWidth={2.4} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

function LotCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded border border-stone-300 bg-stone-50">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="flex justify-between border-y border-dashed border-stone-300 bg-stone-100 px-2" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="-my-px h-1.5 w-1.5 rounded-full bg-stone-50" />
        ))}
      </div>
      <div className="flex flex-col gap-2 px-4 py-4">
        <div className="h-3 w-2/5 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-200" />
        <div className="mt-2 h-3 w-2/3 rounded bg-stone-200" />
      </div>
    </div>
  );
}

function CatalogHome({ items, loading, onViewAll }) {
  const featured = items.slice(0, 4);
  const liveCount = items.filter((i) => i.status === "LIVE").length;

  return (
    <>
      <Header liveCount={liveCount} subtitle="Live lot catalog" onLogoClick={() => {}} />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-7">
          <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-slate-800">Today's featured lots</h1>
          <p className="max-w-xl text-sm text-slate-500">
            Verified vehicles, inspected and sold to the highest bidder. Every lot ships with a full condition report.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <LotCardSkeleton key={i} />)
            : featured.map((item) => <LotCard key={item.id} item={item} />)}
        </div>
        {!loading && items.length === 0 && (
          <p className="py-8 text-sm text-slate-500">No live lots right now — check back shortly.</p>
        )}
        {!loading && items.length > 0 && (
          <div className="mb-2 mt-11 flex justify-center">
            <button
              onClick={onViewAll}
              className="rounded-full bg-slate-800 px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-stone-100 transition-all hover:-translate-y-0.5 hover:bg-amber-800"
            >
              View full catalog ({items.length} lots)
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CatalogAll({ items, loading, onBack }) {
  const liveCount = items.filter((i) => i.status === "LIVE").length;
  const [filter, setFilter] = useState("ALL");

  const subcats = useMemo(
    () => ["ALL", ...new Set(items.map((i) => i.auctionSubCategory?.name).filter(Boolean))],
    [items]
  );
  const filtered = filter === "ALL" ? items : items.filter((i) => i.auctionSubCategory?.name === filter);

  return (
    <>
      <Header liveCount={liveCount} subtitle="Full catalog" onLogoClick={onBack} />
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <button onClick={onBack} className="mb-4.5 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ChevronLeft size={16} strokeWidth={2.4} />
          Back to featured
        </button>

        <div className="mb-7">
          <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-slate-800">Full catalog</h1>
          <p className="text-sm text-slate-500">{loading ? "Loading lots…" : `${filtered.length} of ${items.length} lots`}</p>
        </div>

        {!loading && (
          <div className="mb-7 flex flex-wrap gap-2">
            {subcats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs ${
                  filter === c
                    ? "border-slate-800 bg-slate-800 text-stone-100"
                    : "border-stone-300 bg-stone-50 text-slate-500"
                }`}
              >
                {c === "ALL" ? "All categories" : c}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <LotCardSkeleton key={i} />)
            : filtered.map((item) => <LotCard key={item.id} item={item} />)}
        </div>
        {!loading && filtered.length === 0 && <p className="py-8 text-sm text-slate-500">No lots match this category.</p>}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------
   ROOT
--------------------------------------------------------------------- */

export default function AuctionCatalog() {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const fetchItems = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch(ITEMS_ENDPOINT);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const payload = await res.json();
      const list = normalizeItemsResponse(payload);
      setItems(list);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong while loading lots.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-stone-200 pb-16 font-sans text-slate-800">
      {status === "error" ? (
        <>
          <Header liveCount={0} subtitle="Live lot catalog" onLogoClick={() => {}} />
          <StateNotice
            icon={<AlertTriangle size={28} strokeWidth={2} />}
            title="Couldn't load the catalog"
            message={errorMessage}
            onRetry={fetchItems}
          />
        </>
      ) : page === "home" ? (
        <CatalogHome items={items} loading={status === "loading"} onViewAll={() => setPage("all")} />
      ) : (
        <CatalogAll items={items} loading={status === "loading"} onBack={() => setPage("home")} />
      )}
    </div>
  );
}