import { Star } from 'lucide-react';

export default function OrderSummaryItem({ item, product }) {
    const off =
        product.discountLabel ||
        `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off`;

    const getDeliveryDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
        });
    };

    return (
        <div className="px-5 py-4 border-b border-[#f0f0f0] last:border-b-0">
            {/* Hot Deal badge */}
            {product.discountLabel && parseInt(product.discountLabel) >= 20 && (
                <span className="text-[11px] font-semibold text-[#ff6161] mb-2 block">Hot Deal</span>
            )}

            <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 shrink-0 border border-[#f0f0f0] rounded-sm p-1 bg-white">
                    <img
                        src={product.images?.[0] || '/product-photos/earphones.webp'}
                        alt={product.title}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-[#212121] leading-snug line-clamp-2">
                        {product.title}
                    </h4>
                    {product.highlights?.[0] && (
                        <p className="text-xs text-[#878787] mt-0.5 truncate">
                            {product.highlights[0]}
                        </p>
                    )}

                    {/* Rating + Assured */}
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-[#388e3c] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-semibold">
                            {product.rating} <Star size={9} fill="white" strokeWidth={0} />
                        </span>
                        <span className="text-[11px] text-[#878787]">({product.reviewCount?.toLocaleString('en-IN')})</span>
                        {product.fAssured && (
                            <img
                                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                className="h-3"
                                alt="Assured"
                            />
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs text-[#878787]">Qty: {item.quantity}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-xs text-[#388e3c] font-medium">↓{off}</span>
                        <span className="text-xs text-[#878787] line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-medium text-[#212121]">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Delivery */}
            <div className="mt-2.5 text-xs text-[#212121]">
                Delivery by {getDeliveryDate()} |{' '}
                <span className="line-through text-[#878787] mx-0.5">₹80</span>{' '}
                <span className="text-[#388e3c] font-medium">Free</span>
            </div>
        </div>
    );
}
