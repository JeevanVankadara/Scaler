import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function AccountSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useCart();

    const name = (profile.firstName || profile.lastName) 
        ? `${profile.firstName} ${profile.lastName}`.trim() 
        : 'Guest';

    const isActive = (path) => location.pathname === path;

    return (
        <div className="space-y-3">
            {/* Profile Card */}
            <div className="bg-white shadow-sm rounded-sm">
                <div className="flex items-center gap-3 px-4 py-3.5">
                    <img
                        src="/wishlist/profile-pic-male.svg"
                        alt="profile"
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="min-w-0">
                        <p className="text-xs text-[#878787]">Hello,</p>
                        <p className="text-sm font-semibold text-[#212121] truncate">{name}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-white shadow-sm rounded-sm">
                {/* MY ORDERS */}
                <button
                    onClick={() => navigate('/orders')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 border-b border-[#f0f0f0] hover:bg-[#f5f5f5] transition-colors ${isActive('/orders') ? 'bg-[#f5f5f5]' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <img src="/wishlist/myorders.svg" alt="" className="w-5 h-5 opacity-80" />
                        <span className="text-sm font-medium text-[#878787] tracking-wide uppercase">My Orders</span>
                    </div>
                    <ChevronRight size={16} className="text-[#878787]" />
                </button>

                {/* ACCOUNT SETTINGS Section */}
                <div className="border-b border-[#f0f0f0]">
                    <div className="flex items-center gap-3 px-4 py-3.5">
                        <img src="/wishlist/Account-settings.svg" alt="" className="w-5 h-5 opacity-80" />
                        <span className="text-sm font-medium text-[#878787] tracking-wide uppercase">Account Settings</span>
                    </div>

                    {/* Profile Information */}
                    <button
                        onClick={() => navigate('/profile')}
                        className={`w-full text-left px-4 pl-12 py-2.5 text-[13px] hover:bg-[#f5f5f5] hover:text-[#2874f0] transition-colors ${isActive('/profile') ? 'text-[#2874f0] font-medium bg-[#f5f5f5]' : 'text-[#212121]'}`}
                    >
                        Profile Information
                    </button>

                    <div className="h-2" />
                </div>
            </div>
        </div>
    );
}
