import NavBar from './components/NavBar';
import Footer from './components/Footer';
import OrderFilters from './components/OrderFilters';
import OrderItem from './components/OrderItem';
import { ChevronRight, Search } from 'lucide-react';

const orders = [
    {
        id: 1,
        title: 'URBN 20000 mAh 22.5 W Nano Pocket Size Power Bank',
        price: '₹1,602',
        color: 'Green',
        delivered: 'Jan 07, 2025',
        image: '/product-photos/Pendrives.webp',
    },
    {
        id: 2,
        title: 'Kreo Griphin Wired Optical Gaming Mouse',
        price: '₹1,509',
        color: 'Black',
        delivered: 'Jun 06, 2024',
        image: '/product-photos/Neckbans.webp',
    },
    {
        id: 3,
        title: 'boAt Airdopes 141 Bluetooth Truly Wireless Earbuds',
        price: '₹1,299',
        color: 'Black',
        delivered: 'Mar 15, 2024',
        image: '/product-photos/earphones.webp',
    },
    {
        id: 4,
        title: 'Fire-Boltt Ninja Call Pro Plus Smartwatch',
        price: '₹1,899',
        color: 'Black',
        delivered: 'Feb 20, 2024',
        image: '/product-photos/watches.webp',
    },
];

export default function Orders() {
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

                    <div className="flex gap-3">
                        {/* Left Filter */}
                        <aside className="w-[250px] shrink-0">
                            <OrderFilters />
                        </aside>

                        {/* Right Content */}
                        <div className="flex-1">
                            {/* Search bar */}
                            <div className="bg-white shadow-sm flex mb-3 overflow-hidden rounded-md">
                                <input
                                    placeholder="Search your orders here"
                                    className="flex-1 px-4 py-3 text-sm outline-none placeholder-[#878787]"
                                />
                                <button className="bg-[#2874f0] hover:bg-[#1c5ed8] text-white px-6 flex items-center gap-2 font-medium text-sm">
                                    <Search size={18} />
                                    Search Orders
                                </button>
                            </div>

                            {/* Order list */}
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <OrderItem key={order.id} order={order} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}