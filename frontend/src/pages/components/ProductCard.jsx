import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const assuredBadge = 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png';

function formatPrice(value) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="flex gap-6 p-4 border-b hover:shadow-sm transition-shadow bg-white cursor-pointer"
    >
      <div className="w-[180px] shrink-0 relative">
        <img
          src={product.images?.[0] || product.image || '/product-photos/earphones.webp'}
          alt={product.title}
          className="w-full h-[200px] object-contain"
        />
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-0 right-0 text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={20} fill="transparent" />
        </button>
        <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" className="w-3.5 h-3.5 accent-[#2874f0]" />
          <span className="text-xs text-[#212121]">Add to Compare</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-[#212121] hover:text-[#2874f0] mb-1.5">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-medium">
            {product.rating} <Star size={11} fill="white" />
          </span>
          <span className="text-xs text-[#878787] font-medium">{product.reviews}</span>
        </div>
        <ul className="space-y-1 text-[13px] text-[#212121]">
          {(product.highlights || []).map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-[#c2c2c2]">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-[170px] shrink-0">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-xl font-medium text-[#212121]">{formatPrice(product.price)}</span>
          {product.fAssured && <img src={assuredBadge} alt="Assured" className="h-5 mt-1" />}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-[#878787] line-through">{formatPrice(product.originalPrice)}</span>
          <span className="text-sm text-[#388e3c] font-medium">{product.discountLabel}</span>
        </div>
        {product.exchangeValue > 0 && (
          <p className="text-xs text-[#212121]">
            Upto <span className="font-medium">{formatPrice(product.exchangeValue)}</span> Off on Exchange
          </p>
        )}
        <p className="text-xs text-[#388e3c] font-medium mt-0.5">Bank Offer</p>
      </div>
    </article>
  );
}