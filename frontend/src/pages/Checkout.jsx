import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TotalCost from './components/TotalCost';
import CheckoutStepper from './components/CheckoutStepper';
import OrderSummaryItem from './components/OrderSummaryItem';
import OutOfStockPopup from './components/OutOfStockPopup';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, placeOrder } = useCart();

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState({});
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Stock popup state
    const [stockPopup, setStockPopup] = useState({ open: false, name: '', stock: 0 });

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
    });

    // Fetch product details for order summary
    useEffect(() => {
        if (cartItems.length === 0) {
            setProducts({});
            setLoadingProducts(false);
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
            .catch(() => {})
            .finally(() => setLoadingProducts(false));
    }, [cartItems]);

    const enrichedItems = cartItems
        .map((item) => {
            const product = products[String(item.productId)];
            if (!product) return null;
            return { ...item, product };
        })
        .filter(Boolean);

    const totalOriginal = enrichedItems.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
    const subtotal = enrichedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const discount = totalOriginal - subtotal;
    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ── Step 1 → Step 2 ──
    const handleSaveAddress = (e) => {
        e.preventDefault();

        for (const [key, val] of Object.entries(form)) {
            if (!val.trim()) {
                const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                alert(`Please fill in ${label}`);
                return;
            }
        }

        setStep(2);
    };

    // ── Step 2 → Place Order ──
    const handlePlaceOrder = async () => {
        // Validate stock
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

        setSubmitting(true);
        const order = await placeOrder(form);
        setSubmitting(false);

        if (order) {
            navigate(`/order-confirmation/${order.orderId}`);
        } else {
            alert('Failed to place order. Please try again.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg text-[#212121]">No items to checkout</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-[#2874f0] text-white px-8 py-2.5 rounded-sm text-sm font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1100px] mx-auto py-4 px-4">
                    <div className="flex gap-4">
                        {/* LEFT COLUMN */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                                {/* Stepper */}
                                <CheckoutStepper currentStep={step} />

                                {/* ────────── STEP 1: Address ────────── */}
                                {step === 1 && (
                                    <div>
                                        <div className="bg-[#2874f0] text-white px-6 py-3">
                                            <h2 className="text-sm font-semibold uppercase tracking-wide">
                                                1. Delivery Address
                                            </h2>
                                        </div>

                                        <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
                                            {/* Row 1: Name + Phone */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={form.fullName}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="Enter full name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="10-digit mobile number"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 2: Pincode + Locality */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        Pincode
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={form.pincode}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="6-digit pincode"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        Locality
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="locality"
                                                        value={form.locality}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="Locality/Area"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 3: Full Address */}
                                            <div>
                                                <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                    Address (Area & Street)
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0] resize-none"
                                                    placeholder="Complete address"
                                                />
                                            </div>

                                            {/* Row 4: City + State */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        City/Town
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={form.city}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="City"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-[#878787] font-medium mb-1.5">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={form.state}
                                                        onChange={handleChange}
                                                        className="w-full border border-[#e0e0e0] rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#2874f0]"
                                                        placeholder="State"
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className="pt-4 border-t border-[#f0f0f0] flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="bg-[#fb641b] hover:bg-[#f55a0e] text-white font-medium px-10 py-3 text-sm rounded-sm shadow-sm uppercase tracking-wide"
                                                >
                                                    Save and Deliver Here
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* ────────── STEP 2: Order Summary ────────── */}
                                {step === 2 && (
                                    <div>
                                        {/* Address summary (collapsed) */}
                                        <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#f5f5f5]">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs text-[#878787] mb-1">Deliver to:</p>
                                                    <p className="text-sm font-medium text-[#212121]">
                                                        {form.fullName}{' '}
                                                        <span className="text-[10px] bg-[#f0f0f0] text-[#878787] px-1.5 py-0.5 rounded-sm font-medium ml-1 uppercase">
                                                            Home
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-[#212121] mt-1">
                                                        {form.address}, {form.locality}, {form.city}, {form.state} {form.pincode}
                                                    </p>
                                                    <p className="text-sm text-[#212121] mt-0.5">{form.phone}</p>
                                                </div>
                                                <button
                                                    onClick={() => setStep(1)}
                                                    className="text-[#2874f0] text-sm font-medium border border-[#e0e0e0] px-4 py-1.5 rounded-sm hover:bg-[#f5f7ff] transition-colors shrink-0"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Summary header */}
                                        <div className="bg-[#2874f0] text-white px-6 py-3">
                                            <h2 className="text-sm font-semibold uppercase tracking-wide">
                                                2. Order Summary
                                            </h2>
                                        </div>

                                        {/* Order items */}
                                        {loadingProducts ? (
                                            <div className="flex items-center justify-center py-10">
                                                <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : (
                                            <div>
                                                {enrichedItems.map((item) => (
                                                    <OrderSummaryItem
                                                        key={item.productId}
                                                        item={item}
                                                        product={item.product}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR — Price Details */}
                        <div className="w-80 shrink-0">
                            <div className="sticky top-20">
                                <TotalCost
                                    itemCount={enrichedItems.length}
                                    subtotal={totalOriginal}
                                    discount={discount}
                                    deliveryCharge={deliveryCharge}
                                    total={total}
                                />

                                {/* Continue / Place Order bar */}
                                {step === 2 && (
                                    <div className="bg-white shadow-sm mt-3 px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-lg font-semibold text-[#212121]">
                                                ₹{total.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={submitting}
                                            className="bg-[#ffc200] hover:bg-[#ffb800] disabled:opacity-60 text-[#212121] font-semibold px-8 py-3 text-sm rounded-sm transition-colors"
                                        >
                                            {submitting ? 'Placing...' : 'Continue'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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