import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TotalCost from './components/TotalCost';
import OutOfStockPopup from './components/OutOfStockPopup';
import { ChevronDown } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MAX_QTY = 6;

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, setBuyNow } = useCart();
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    // Session-only "saved for later" — resets when user navigates away
    const [savedIds, setSavedIds] = useState([]);

    // Out-of-stock popup state
    const [stockPopup, setStockPopup] = useState({ open: false, name: '', stock: 0 });

    // Fetch full product details for cart items
    useEffect(() => {
        if (cartItems.length === 0) {
            setProducts({});
            setLoading(false);
            return;
        }

        const ids = cartItems.map((i) => i.productId);
        fetch(`${API}/products/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    const map = {};
                    data.products.forEach((p) => {
                        map[String(p.id)] = p;
                    });
                    setProducts(map);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [cartItems]);

    const getDeliveryDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', weekday: 'short' });
    };

    const enrichedItems = cartItems
        .map((item) => {
            const product = products[String(item.productId)];
            if (!product) return null;
            return { ...item, product };
        })
        .filter(Boolean);

    // Split into active & saved
    const activeItems = enrichedItems.filter((i) => !savedIds.includes(String(i.productId)));
    const savedItems = enrichedItems.filter((i) => savedIds.includes(String(i.productId)));

    // Only active items count towards totals
    const subtotal = activeItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const totalOriginal = activeItems.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
    const discount = totalOriginal - subtotal;
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    // ── Save for later / Move to cart (session only) ──
    const handleSaveForLater = (productId) => {
        setSavedIds((prev) => [...prev, String(productId)]);
    };

    const handleMoveToCart = (productId) => {
        setSavedIds((prev) => prev.filter((id) => id !== String(productId)));
    };

    // ── Buy this now ──
    const handleBuyNow = (item) => {
        const product = products[String(item.productId)];
        if (product && item.quantity > product.stock) {
            setStockPopup({ open: true, name: product.title, stock: product.stock });
            return;
        }
        setBuyNow(item.productId, item.quantity);
        navigate('/checkout?buyNow=true');
    };

    // ── Place Order (full cart) ──
    const handlePlaceOrder = () => {
        for (const item of activeItems) {
            if (item.quantity > item.product.stock) {
                setStockPopup({
                    open: true,
                    name: item.product.title,
                    stock: item.product.stock,
                });
                return;
            }
        }
        navigate('/checkout');
    };

    // ── Quantity change handler ──
    const handleQtyChange = (productId, newQty, stock) => {
        const clamped = Math.min(newQty, MAX_QTY, stock);
        if (clamped <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, clamped);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                {enrichedItems.length === 0 ? (
                    <div className="max-w-[1250px] mx-auto py-20 text-center">
                        <p className="text-lg text-[#212121]">Your cart is empty!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-[#2874f0] text-white px-8 py-2.5 rounded-sm text-sm font-medium"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="max-w-[1250px] mx-auto flex flex-col lg:flex-row gap-3 py-2.5 px-2 md:px-3.5">
                        {/* LEFT */}
                        <div className="flex-1 w-full lg:w-auto min-w-0">
                            {/* ═══════ ACTIVE CART ═══════ */}
                            <div className="bg-white shadow-sm">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <h2 className="text-base font-medium text-[#212121]">
                                        Flipkart ({activeItems.length})
                                    </h2>
                                </div>

                                {activeItems.length === 0 ? (
                                    <div className="px-4 py-10 text-center text-sm text-[#878787]">
                                        All items have been saved for later
                                    </div>
                                ) : (
                                    activeItems.map((item, idx) => (
                                        <CartItemCard
                                            key={item.productId}
                                            item={item}
                                            isLast={idx === activeItems.length - 1}
                                            onQtyChange={handleQtyChange}
                                            onSaveForLater={handleSaveForLater}
                                            onRemove={removeFromCart}
                                            onBuyNow={handleBuyNow}
                                            navigate={navigate}
                                            getDeliveryDate={getDeliveryDate}
                                        />
                                    ))
                                )}

                                {activeItems.length > 0 && (
                                    <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_4px_rgba(0,0,0,0.04)] px-4 py-2.5 flex justify-end">
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="bg-[#fb641b] hover:bg-[#f55a0e] text-white font-medium px-12 py-3 text-sm rounded-sm shadow-sm uppercase tracking-wide"
                                        >
                                            Place Order
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ═══════ SAVED FOR LATER ═══════ */}
                            {savedItems.length > 0 && (
                                <div className="bg-white shadow-sm mt-3">
                                    <div className="px-4 py-3 border-b">
                                        <h2 className="text-base font-medium text-[#212121]">
                                            Saved For Later ({savedItems.length})
                                        </h2>
                                    </div>

                                    {savedItems.map((item, idx) => (
                                        <SavedItemCard
                                            key={item.productId}
                                            item={item}
                                            isLast={idx === savedItems.length - 1}
                                            onMoveToCart={handleMoveToCart}
                                            onRemove={removeFromCart}
                                            navigate={navigate}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="w-80 shrink-0">
                            <div className="sticky top-20">
                                <TotalCost
                                    itemCount={activeItems.length}
                                    subtotal={totalOriginal}
                                    discount={discount}
                                    deliveryCharge={deliveryCharge}
                                    total={total}
                                />
                                <div className="flex items-start gap-2 mt-4 px-2 text-xs text-[#878787]">
                                    <img
                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_5f9216.png"
                                        className="w-5 h-5 mt-0.5"
                                        alt=""
                                    />
                                    <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* Out of Stock Popup */}
            <OutOfStockPopup
                isOpen={stockPopup.open}
                onClose={() => setStockPopup({ open: false, name: '', stock: 0 })}
                productName={stockPopup.name}
                availableStock={stockPopup.stock}
            />
        </div>
    );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CART ITEM CARD — Active item row
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CartItemCard({ item, isLast, onQtyChange, onSaveForLater, onRemove, onBuyNow, navigate, getDeliveryDate }) {
    const p = item.product;
    const stock = p.stock || 0;
    const maxQty = Math.min(MAX_QTY, stock);
    const off = p.discountLabel || `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off`;
    const isOverStock = item.quantity > stock;

    return (
        <div className={`${!isLast ? 'border-b' : ''}`}>
            {/* ── Super deals badge ── */}
            {p.discountLabel && (
                <div className="px-4 pt-3">
                    <span className="text-xs font-bold text-[#388e3c] uppercase tracking-wide">Super Deals</span>
                </div>
            )}

            <div className="px-4 py-4">
                <div className="flex gap-4">
                    {/* Image + Qty dropdown */}
                    <div className="w-28 shrink-0">
                        <img
                            src={p.images?.[0] || '/product-photos/earphones.webp'}
                            alt={p.title}
                            className="w-28 h-28 object-contain mx-auto cursor-pointer"
                            onClick={() => navigate(`/product/${p.id}`)}
                        />

                        {/* Quantity dropdown */}
                        <div className="mt-3 flex flex-col items-center">
                            <div className="relative inline-block">
                                <select
                                    value={item.quantity}
                                    onChange={(e) => onQtyChange(item.productId, Number(e.target.value), stock)}
                                    className="appearance-none border border-[#c2c2c2] rounded-sm pl-2.5 pr-7 py-1 text-xs font-medium text-[#212121] bg-white cursor-pointer focus:outline-none focus:border-[#2874f0] hover:shadow-sm"
                                    style={{ minWidth: '64px' }}
                                >
                                    {Array.from({ length: maxQty }, (_, i) => i + 1).map((q) => (
                                        <option key={q} value={q}>
                                            Qty: {q}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={12}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#878787] pointer-events-none"
                                />
                            </div>

                            {/* "Only X left" indicator */}
                            {stock <= 5 && stock > 0 && (
                                <span className="text-[11px] font-medium text-[#ff6161] mt-1">
                                    Only {stock} left
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product details */}
                    <div className="flex-1">
                        <div className="flex justify-between gap-3">
                            <div>
                                <h3
                                    className="text-sm md:text-base text-[#212121] line-clamp-1 cursor-pointer hover:text-[#2874f0]"
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    {p.title}
                                </h3>
                                {p.highlights?.[0] && (
                                    <p className="text-xs text-[#878787] mt-0.5 line-clamp-1">{p.highlights[0]}</p>
                                )}

                                {/* Rating + Assured */}
                                <div className="flex items-center gap-2 mt-1.5">
                                    {p.rating > 0 && (
                                        <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-[1px] rounded-sm">
                                            {p.rating} ★
                                        </span>
                                    )}
                                    {p.reviewCount > 0 && (
                                        <span className="text-xs text-[#878787]">({p.reviewCount})</span>
                                    )}
                                    {p.fAssured && (
                                        <img
                                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                            className="h-3.5"
                                            alt="assured"
                                        />
                                    )}
                                </div>

                                {/* Price row */}
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-xs text-[#388e3c] font-medium">↓{off}</span>
                                    <span className="text-xs text-[#878787] line-through">
                                        ₹{p.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-base font-medium text-[#212121]">
                                        ₹{p.price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-xs text-[#212121] whitespace-nowrap">
                                    Delivery by {getDeliveryDate()} |
                                    <span className="line-through text-[#878787] mx-1">₹80</span>
                                    <span className="text-[#388e3c]">Free</span>
                                </p>
                            </div>
                        </div>

                        {/* Stock exceeded warning */}
                        {isOverStock && (
                            <div className="mt-2 px-3 py-1.5 bg-[#fff5f5] border border-[#ff6161] rounded-sm">
                                <span className="text-xs text-[#ff6161] font-medium">
                                    ⚠ Only {stock} items available. Please reduce quantity.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Action buttons bar ── */}
            <div className="flex items-stretch border-t border-[#f0f0f0]">
                <button
                    onClick={() => onSaveForLater(item.productId)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#878787] hover:bg-[#f5f5f5] transition-colors border-r border-[#f0f0f0]"
                >
                    <img src="/orders/Save-for-later.png" alt="" className="w-4 h-4 opacity-60" />
                    Save for later
                </button>
                <button
                    onClick={() => onRemove(item.productId)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#878787] hover:bg-[#f5f5f5] transition-colors border-r border-[#f0f0f0]"
                >
                    <img src="/orders/bin.png" alt="" className="w-4 h-4 opacity-60" />
                    Remove
                </button>
                <button
                    onClick={() => onBuyNow(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#878787] hover:bg-[#f5f5f5] transition-colors"
                >
                    <img src="/orders/instant-buy.png" alt="" className="w-4 h-4 opacity-60" />
                    Buy this now
                </button>
            </div>
        </div>
    );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SAVED ITEM CARD — Saved for later row
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SavedItemCard({ item, isLast, onMoveToCart, onRemove, navigate }) {
    const p = item.product;
    const off = p.discountLabel || `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off`;

    return (
        <div className={`px-4 py-4 ${!isLast ? 'border-b' : ''}`}>
            <div className="flex gap-4">
                <div className="w-28 shrink-0">
                    <img
                        src={p.images?.[0] || '/product-photos/earphones.webp'}
                        alt={p.title}
                        className="w-28 h-28 object-contain mx-auto cursor-pointer"
                        onClick={() => navigate(`/product/${p.id}`)}
                    />
                </div>

                <div className="flex-1">
                    <h3
                        className="text-sm md:text-base text-[#212121] line-clamp-1 cursor-pointer hover:text-[#2874f0]"
                        onClick={() => navigate(`/product/${p.id}`)}
                    >
                        {p.title}
                    </h3>
                    {p.highlights?.[0] && (
                        <p className="text-xs text-[#878787] mt-0.5 line-clamp-1">{p.highlights[0]}</p>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-xs text-[#388e3c] font-medium">↓{off}</span>
                        <span className="text-xs text-[#878787] line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-base font-medium text-[#212121]">
                            ₹{p.price.toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 mt-3 pt-2.5">
                        <button
                            onClick={() => onMoveToCart(item.productId)}
                            className="text-sm font-medium text-[#2874f0] hover:underline"
                        >
                            Move to Cart
                        </button>
                        <button
                            onClick={() => onRemove(item.productId)}
                            className="text-sm font-medium text-[#878787] hover:text-[#ff6161] flex items-center gap-1"
                        >
                            <img src="/orders/bin.png" alt="" className="w-3.5 h-3.5 opacity-50" />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}