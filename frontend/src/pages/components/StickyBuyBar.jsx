import { ShoppingCart } from 'lucide-react';

function formatPrice(value) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

export default function StickyBuyBar({ price, onAddToCart, onBuyNow, isOutOfStock }) {
  return (
    <div className="bg-white border-t border-[#e0e0e0] shadow-[0_-2px_8px_rgba(0,0,0,0.06)] p-2.5 flex items-center gap-2 sticky bottom-0 z-10">
      <button
        onClick={onAddToCart}
        className="w-12 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ShoppingCart size={22} />
      </button>
      <button
        onClick={onBuyNow}
        disabled={isOutOfStock}
        className={`flex-1 rounded-xl h-12 flex flex-col items-center justify-center transition-colors ${
          isOutOfStock 
            ? 'bg-[#f5f5f5] cursor-not-allowed text-[#b0b0b0] border border-[#e0e0e0]' 
            : 'bg-[#ffc200] hover:bg-[#ffb800]'
        }`}
      >
        <span className="text-sm font-medium leading-none">Buy now</span>
        {!isOutOfStock && <span className="text-xs leading-none mt-0.5">at {formatPrice(price)}</span>}
      </button>
    </div>
  );
}