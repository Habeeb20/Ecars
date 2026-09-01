import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Loader2, ArrowLeft, ShieldCheck, MapPin, Eye, Heart, Share2,
  Package, ExternalLink, Store,
} from 'lucide-react';

const API_URL = 'https://api.estores.ng/api/products/category?category=automotive';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p) => p._id === id);
          if (found) {
            setProduct(found);
          } else {
            toast.error('Product not found');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/" className="text-[#0B1B3E] font-semibold hover:underline mt-2 inline-block">
          Back home
        </Link>
      </div>
    );
  }

  // ⚠️ Guessed URL pattern — replace with the real Estores product/store link
  const buyUrl = `https://estores.ng/product/${product._id}`;

  const specs = [
    { label: 'Maker', value: product.maker },
    { label: 'Year', value: product.yearOfMake },
    { label: 'Transmission', value: product.gearTransmission },
    { label: 'Fuel Type', value: product.fuelType },
    { label: 'Part Type', value: product.whatPart },
    { label: 'Category', value: product.subCategoryPart },
    { label: 'Grade', value: product.grade },
    { label: 'Stock', value: product.stockQuantity },
  ].filter((s) => s.value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
            {product.images?.[activeImage]?.url && (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-[#0B1B3E]' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.grade && (
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-blue-100 text-blue-700">
                {product.grade}
              </span>
            )}
            {product.status === 'active' && (
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-700">
                In Stock
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-[#0B1B3E] dark:text-white mb-4">
            ₦{product.price?.toLocaleString()}
          </p>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-1">
              <Eye size={14} /> {product.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} /> {product.likes}
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={14} /> {product.shares}
            </span>
            <span className="flex items-center gap-1">
              <Package size={14} /> {product.sold} sold
            </span>
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {specs.map((s) => (
                <div key={s.label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-[11px] text-gray-400">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Seller */}
          <div className="flex items-center gap-3 p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl mb-6">
            <img
              src={product.seller?.avatar}
              alt={product.seller?.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1 truncate">
                {product.seller?.displayName}
                {product.seller?.verified && <ShieldCheck size={13} className="text-emerald-600 shrink-0" />}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <MapPin size={11} className="shrink-0" /> {product.seller?.location}
              </p>
              {product.seller?.market && (
                <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                  <Store size={11} className="shrink-0" /> {product.seller.market}
                </p>
              )}
            </div>
          </div>

          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-gradient-to-r from-[#0B1B3E] to-[#16255C] text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            View on Estores
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}