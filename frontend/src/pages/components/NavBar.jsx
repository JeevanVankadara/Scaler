import { ChevronDown, ChevronRight, Search } from 'lucide-react';

export default function NavBar({ cartCount = 0 }) {
    return (
        <header className="bg-white sticky top-0 z-50 px-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* ---------- Top Row ---------- */}
                <div className="flex items-center justify-between h-12 mb-3 mt-2">
                    {/* Left: Yellow Flipkart pill */}
                    <div className="flex items-center gap-2">
                        <a href="/" className="flex items-center gap-2 bg-[#ffe500] hover:bg-[#f7db00] transition rounded-xl px-4 py-1.5">
                            <img
                                src="/flipkart-logo.webp"
                                alt="f"
                                className="w-6 h-6 object-contain"
                            />
                            <span className="text-sm font-semibold italic text-black tracking-tight">Flipkart</span>
                        </a>
                        {/* Travel REMOVED */}
                    </div>

                    {/* Right: Location */}
                    <div className="hidden md:flex items-center gap-1.5 text-sm">
                        <img src="/location.png" alt="location" className="w-4 h-4" />
                        <span className="text-[#212121] font-bold">Location not set</span>
                        <button className="text-[#2a55e5] font-medium flex items-center hover:underline font-bold">
                            Select delivery location
                            <ChevronRight size={18} className="mt-0.5" />
                        </button>
                    </div>
                </div>

                {/* ---------- Search Row ---------- */}
                <div className="flex items-center gap-6 pb-3">
                    {/* Search - takes most space */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717478]" size={20} strokeWidth={2.2} />
                            <input
                                type="text"
                                placeholder="Search for Products, Brands and More"
                                className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#2a55e5] rounded-lg outline-none placeholder-[#717478] focus:shadow-[0_0_0_1px_#2a55e5]"
                            />
                        </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-7 shrink-0">
                        {/* Login */}
                        <div className="relative group">
                            <button className="flex items-center gap-2">
                                <img src="/login-icon.svg" alt="login" className="w-6 h-6" />
                                <span className="text-sm text-[#212121]">Login</span>
                                <ChevronDown size={16} className="text-[#717478] group-hover:rotate-180 transition-transform" />
                            </button>
                            {/* dropdown */}
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded shadow-[0_4px_16px_rgba(0,0,0,0.15)] border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="p-4 text-sm border-b">
                                    New customer? <span className="text-[#2a55e5] font-medium cursor-pointer">Sign Up</span>
                                </div>
                                <div className="p-2 text-sm">
                                    <div className="px-2 py-2 hover:bg-gray-50 cursor-pointer">My Profile</div>
                                    <div className="px-2 py-2 hover:bg-gray-50 cursor-pointer">Orders</div>
                                </div>
                            </div>
                        </div>

                        {/* More */}
                        <div className="hidden lg:flex relative group">
                            <button className="flex items-center gap-1">
                                <span className="text-sm text-[#212121]">More</span>
                                <ChevronDown size={16} className="text-[#717478] group-hover:rotate-180 transition-transform" />
                            </button>
                        </div>

                        {/* Cart */}
                        <a href="/cart" className="flex items-center gap-2">
                            <div className="relative">
                                <img src="/cart-icon.svg" alt="cart" className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-[#ff6161] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-[#212121] hidden sm:block">Cart</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* border is handled by CategoryNav's border-t */}
        </header>
    );
}