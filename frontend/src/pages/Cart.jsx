import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TotalCost from './components/TotalCost';
import { ChevronDown, Minus, Plus } from 'lucide-react';

const cartItems = [
    {
        id: 1,
        name: 'Unique Utilities Ceramic Coffee Milk Cup (Purple) - 450 ML',
        spec: '450 ml',
        seller: 'CorsecaDel',
        price: 300,
        mrp: 499,
        off: '39%',
        img: '/product-photos/earphones.webp',
        delivery: 'Apr 22, Wed',
    },
    {
        id: 2,
        name: 'valida ashmi Camera Lens Shape Cup Plastic Coffee Mug',
        spec: '400 ml',
        seller: 'VIVIDFLEXRETAIL',
        price: 289,
        mrp: 929,
        off: '68%',
        img: '/product-photos/watches.webp',
        delivery: 'Apr 22, Wed',
    },
];

export default function Cart() {
    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar cartCount={2} />

            <main className="flex-1">
                <div className="max-w-[1250px] mx-auto flex gap-3 py-2.5 px-3.5">
                    {/* LEFT */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white shadow-sm">
                            {/* Header */}
                            <div className="px-4 py-3 border-b flex items-center justify-between">
                                <h2 className="text-base font-medium text-[#212121]">Flipkart ({cartItems.length})</h2>
                            </div>

                            {/* Address bar */}
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

                            {/* Items */}
                            {cartItems.map((item, idx) => (
                                <div key={item.id} className={`px-4 py-4 ${idx !== cartItems.length - 1 ? 'border-b' : ''}`}>
                                    <div className="flex gap-4">
                                        {/* Image + qty */}
                                        <div className="w-[70px] shrink-0">
                                            <img src={item.img} alt="" className="w-[70px] h-[70px] object-contain mx-auto" />
                                            <div className="flex items-center justify-center gap-2 mt-3">
                                                <button className="w-6 h-6 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#878787] hover:bg-gray-50">
                                                    <Minus size={12} />
                                                </button>
                                                <div className="w-8 h-6 border border-[#e0e0e0] flex items-center justify-center text-xs font-medium">1</div>
                                                <button className="w-6 h-6 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#878787] hover:bg-gray-50">
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between gap-3">
                                                <div>
                                                    <h3 className="text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer leading-snug">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-[#878787] mt-0.5">{item.spec}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-xs text-[#878787]">Seller: {item.seller}</span>
                                                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-3.5" alt="assured" />
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mt-2">
                                                        <span className="text-xs text-[#388e3c] font-medium">↓{item.off}</span>
                                                        <span className="text-xs text-[#878787] line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                                                        <span className="text-base font-medium text-[#212121]">₹{item.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <p className="text-xs text-[#212121] whitespace-nowrap">
                                                        Delivery by {item.delivery} |
                                                        <span className="line-through text-[#878787] mx-1">₹80</span>
                                                        <span className="text-[#388e3c]">Free</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Coupon */}
                                            <div className="flex items-center justify-between mt-3 py-2 border-t border-b border-dashed border-[#e0e0e0]">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <img src="/save-image.webp" alt="save" className="w-4 h-4" />
                                                    <span>Save extra <b>₹60</b> with Coupon</span>
                                                </div>
                                                <button className="text-[#2874f0] font-medium text-xs uppercase">Apply</button>
                                            </div>

                                            <p className="text-xs text-[#878787] mt-1.5">Delivery by {item.delivery}</p>

                                            <div className="flex items-center gap-6 mt-3 pt-2.5 border-t border-[#e0e0e0]">
                                                <button className="text-xs font-medium text-[#212121] hover:text-[#2874f0] flex items-center gap-1">
                                                    📋 Save for later
                                                </button>
                                                <button className="text-xs font-medium text-[#212121] hover:text-[#2874f0] flex items-center gap-1">
                                                    🗑️ Remove
                                                </button>
                                                <button className="text-xs font-medium text-[#212121] hover:text-[#2874f0] flex items-center gap-1">
                                                    ✨ Buy this now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Place Order bar */}
                            <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_4px_rgba(0,0,0,0.04)] px-4 py-2.5 flex justify-end">
                                <button className="bg-[#fb641b] hover:bg-[#f55a0e] text-white font-medium px-12 py-3 text-sm rounded-sm shadow-sm uppercase tracking-wide">
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="w-[340px] shrink-0">
                        <div className="sticky top-[80px]">
                            <TotalCost />
                            <div className="flex items-start gap-2 mt-4 px-2 text-xs text-[#878787]">
                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_5f9216.png" className="w-5 h-5 mt-0.5" alt="" />
                                <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}