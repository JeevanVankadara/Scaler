import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import OrderFilters from './components/OrderFilters';
import OrderItem from './components/OrderItem';
import { ChevronRight, Search } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Orders() {
    const { orders: localOrders } = useCart();
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try fetching from API first, fall back to localStorage
        fetch(`${API}/orders`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.orders.length > 0) {
                    setOrders(data.orders);
                } else {
                    setOrders(localOrders);
                }
            })
            .catch(() => {
                setOrders(localOrders);
            })
            .finally(() => setLoading(false));
    }, [localOrders]);

    const filteredOrders = orders.filter((order) => {
        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesItems = order.items?.some((item) =>
                (item.title || '').toLowerCase().includes(q)
            );
            const matchesId = order.orderId?.toLowerCase().includes(q);
            if (!matchesItems && !matchesId) return false;
        }

        // Status filter
        if (statusFilter.length > 0) {
            if (!statusFilter.includes(order.status)) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1250px] mx-auto px-3.5 py-3">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-[#878787] mb-3">
                        <span className="hover:text-[#2874f0] cursor-pointer">Home</span>
                        <ChevronRight size={14} />
                        <span className="hover:text-[#2874f0] cursor-pointer">My Account</span>
                        <ChevronRight size={14} />
                        <span className="text-[#212121]">My Orders</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Left Filter */}
                        <aside className="w-full lg:w-[250px] shrink-0">
                            <OrderFilters
                                statusFilter={statusFilter}
                                onStatusChange={setStatusFilter}
                            />
                        </aside>

                        {/* Right Content */}
                        <div className="flex-1">
                            {/* Search bar */}
                            <div className="bg-white shadow-sm flex mb-3 overflow-hidden rounded-md">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search your orders here"
                                    className="flex-1 px-4 py-3 text-sm outline-none placeholder-[#878787]"
                                />
                                <button className="bg-[#2874f0] hover:bg-[#1c5ed8] text-white px-6 flex items-center gap-2 font-medium text-sm">
                                    <Search size={18} />
                                    Search Orders
                                </button>
                            </div>

                            {/* Order list */}
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="bg-white shadow-sm rounded-md text-center py-16">
                                    <p className="text-lg text-[#212121]">No orders found</p>
                                    <p className="text-sm text-[#878787] mt-1">Looks like you haven't placed any orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredOrders.map((order) => (
                                        <OrderItem key={order.orderId} order={order} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}