import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, placeOrder } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const [key, val] of Object.entries(form)) {
            if (!val.trim()) {
                const label = key.replace(/([A-Z])/g, ' \$1').toLowerCase();
                alert(`Please fill in ${label}`);
                return;
            }
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
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
                <div className="max-w-3xl mx-auto py-6 px-4">
                    <div className="bg-white shadow-sm rounded-sm">
                        {/* Header */}
                        <div className="bg-[#2874f0] text-white px-6 py-4 rounded-t-sm">
                            <h1 className="text-lg font-medium">Delivery Address</h1>
                            <p className="text-sm opacity-80 mt-1">
                                {cartItems.length} item(s) in cart
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-[#f0f0f0] flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#fb641b] hover:bg-[#f55a0e] disabled:opacity-60 text-white font-medium px-12 py-3 text-sm rounded-sm shadow-sm uppercase tracking-wide"
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}