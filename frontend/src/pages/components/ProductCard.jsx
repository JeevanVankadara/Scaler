import { Star } from 'lucide-react';
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
      className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 border-b hover:shadow-sm transition-shadow bg-white cursor-pointer"
    >
      <div className="w-full md:w-[180px] shrink-0 relative flex justify-center bg-[#f8f8f8] md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0">
        <img
          src={product.images?.[0] || product.image || '/product-photos/earphones.webp'}
          alt={product.title}
          loading="lazy"
          className="w-full h-[180px] md:h-[200px] object-contain mix-blend-multiply"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-[#212121] md:hover:text-[#2874f0] mb-1.5 line-clamp-2 md:line-clamp-none">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-medium">
            {product.rating} <Star size={11} fill="white" />
          </span>
          <span className="text-xs text-[#878787] font-medium">{product.reviews}</span>
        </div>
        <ul className="space-y-1 text-[13px] text-[#212121] hidden md:block">
          {(product.highlights || []).map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-[#c2c2c2]">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-[170px] shrink-0 flex flex-wrap md:flex-col items-center md:items-start gap-x-4 gap-y-1 md:gap-0 mt-1 md:mt-0">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xl font-medium text-[#212121]">{formatPrice(product.price)}</span>
          {product.fAssured && <img src={assuredBadge} alt="Assured" className="h-5" />}
        </div>
        <div className="flex items-center gap-2 mb-1 w-full md:w-auto">
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