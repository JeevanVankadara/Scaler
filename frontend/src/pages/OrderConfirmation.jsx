import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try localStorage first
        const local = orders.find((o) => o.orderId === orderId);
        if (local) {
            setOrder(local);
            setLoading(false);
            return;
        }

        // Fallback to API
        fetch(`${API}/orders/${orderId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setOrder(data.order);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [orderId, orders]);

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
                <div className="max-w-2xl mx-auto py-10 px-4">
                    <div className="bg-white shadow-sm rounded-sm text-center py-10 px-6">
                        <CheckCircle size={64} className="text-[#26a541] mx-auto mb-4" />
                        <h1 className="text-2xl font-medium text-[#212121]">Order Placed Successfully!</h1>
                        <p className="text-sm text-[#878787] mt-2">Thank you for shopping with Flipkart</p>

                        {order && (
                            <div className="mt-8 text-left max-w-md mx-auto">
                                <div className="bg-[#f5f5f5] rounded-sm p-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#878787]">Order ID</span>
                                        <span className="font-medium text-[#212121]">{order.orderId}</span>
                                    </div>
                                    {order.estimatedDelivery && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#878787]">Estimated Delivery</span>
                                            <span className="font-medium text-[#212121]">{order.estimatedDelivery}</span>
                                        </div>
                                    )}
                                    {order.total && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#878787]">Total Amount</span>
                                            <span className="font-medium text-[#212121]">₹{order.total.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    {order.status && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#878787]">Status</span>
                                            <span className="font-medium text-[#26a541] capitalize">{order.status}</span>
                                        </div>
                                    )}
                                </div>

                                {order.items?.length > 0 && (
                                    <div className="mt-5 border-t pt-4">
                                        <h3 className="text-sm font-medium text-[#212121] mb-3">Items Ordered</h3>
                                        <div className="space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    {item.image && (
                                                        <img src={item.image} alt="" className="w-12 h-12 object-contain rounded border border-[#f0f0f0]" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-[#212121] truncate">{item.title || `Product ${item.productId}`}</p>
                                                        <p className="text-xs text-[#878787]">Qty: {item.quantity}</p>
                                                    </div>
                                                    {item.price > 0 && (
                                                        <span className="text-sm font-medium text-[#212121]">
                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {order.shippingAddress && (
                                    <div className="mt-5 border-t pt-4">
                                        <h3 className="text-sm font-medium text-[#212121] mb-2">Delivery Address</h3>
                                        <p className="text-sm text-[#878787]">
                                            {order.shippingAddress.fullName}, {order.shippingAddress.address},{' '}
                                            {order.shippingAddress.locality}, {order.shippingAddress.city},{' '}
                                            {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#2874f0] hover:bg-[#1c5ed8] text-white px-8 py-2.5 rounded-sm text-sm font-medium"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="border border-[#e0e0e0] hover:border-[#2874f0] text-[#2874f0] px-8 py-2.5 rounded-sm text-sm font-medium"
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}