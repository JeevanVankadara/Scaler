import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TotalCost from './components/TotalCost';
import OutOfStockPopup from './components/OutOfStockPopup';
import { ChevronDown, Minus, Plus } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

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

    const subtotal = enrichedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const totalOriginal = enrichedItems.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
    const discount = totalOriginal - subtotal;
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    // ── Stock-checked quantity increase ──
    const handleIncrease = (item) => {
        const product = products[String(item.productId)];
        if (product && item.quantity >= product.stock) {
            setStockPopup({
                open: true,
                name: product.title,
                stock: product.stock,
            });
            return;
        }
        updateQuantity(item.productId, item.quantity + 1);
    };

    // ── Stock-checked "Place Order" ──
    const handlePlaceOrder = () => {
        // Validate stock for all items
        for (const item of enrichedItems) {
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
                            <div className="bg-white shadow-sm">
                                <div className="px-4 py-3 border-b flex items-center justify-between">
                                    <h2 className="text-base font-medium text-[#212121]">
                                        Flipkart ({enrichedItems.length})
                                    </h2>
                                </div>

                                <div className="px-4 py-2.5 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#878787]">From Saved Addresses</span>
                                        <button className="w-6 h-6 border border-[#e0e0e0] flex items-center justify-center text-[#2874f0]">
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>
                                    <button className="text-[#2874f0] border border-[#e0e0e0] px-3 py-1 text-xs font-medium hover:shadow-sm">
                                        Enter Delivery Pincode
                                    </button>
                                </div>

                                {enrichedItems.map((item, idx) => {
                                    const p = item.product;
                                    const off = p.discountLabel || `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off`;

                                    return (
                                        <div key={item.productId} className={`px-4 py-4 ${idx !== enrichedItems.length - 1 ? 'border-b' : ''}`}>
                                            <div className="flex gap-4">
                                                <div className="w-28 shrink-0">
                                                    <img
                                                        src={p.images?.[0] || '/product-photos/earphones.webp'}
                                                        alt={p.title}
                                                        className="w-28 h-28 object-contain mx-auto cursor-pointer"
                                                        onClick={() => navigate(`/product/${p.id}`)}
                                                    />
                                                    <div className="flex items-center justify-center gap-2 mt-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="w-6 h-6 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#878787] hover:bg-gray-50"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <div className="w-8 h-6 border border-[#e0e0e0] flex items-center justify-center text-xs font-medium">
                                                            {item.quantity}
                                                        </div>
                                                        <button
                                                            onClick={() => handleIncrease(item)}
                                                            className="w-6 h-6 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#878787] hover:bg-gray-50"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-sm md:text-base text-[#212121] line-clamp-1 cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>{p.title}</h3>
                                                            {p.highlights?.[0] && (
                                                                <p className="text-xs text-[#878787] mt-0.5 line-clamp-1">{p.highlights[0]}</p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                {p.fAssured && (
                                                                    <img
                                                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                                                        className="h-3.5"
                                                                        alt="assured"
                                                                    />
                                                                )}
                                                            </div>
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

                                                    <div className="flex items-center gap-6 mt-3 pt-2.5 border-t border-[#e0e0e0]">
                                                        <button
                                                            onClick={() => removeFromCart(item.productId)}
                                                            className="text-xs font-medium text-[#212121] hover:text-[#2874f0] flex items-center gap-1"
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_4px_rgba(0,0,0,0.04)] px-4 py-2.5 flex justify-end">
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="bg-[#fb641b] hover:bg-[#f55a0e] text-white font-medium px-12 py-3 text-sm rounded-sm shadow-sm uppercase tracking-wide"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="w-80 shrink-0">
                            <div className="sticky top-20">
                                <TotalCost
                                    itemCount={enrichedItems.length}
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