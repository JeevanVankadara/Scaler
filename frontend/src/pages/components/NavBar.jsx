import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function NavBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    // Store the user's actual typed text so we can restore it on Escape or re-navigation
    const [userQuery, setUserQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { cartCount, profile, logout } = useCart();

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    // ── Fetch suggestions with debounce ──
    const fetchSuggestions = useCallback((query) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/products/suggestions?q=${encodeURIComponent(query.trim())}`);
                const data = await res.json();
                if (data.success && data.suggestions?.length > 0) {
                    setSuggestions(data.suggestions);
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                    setShowDropdown(false);
                }
            } catch {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 200);
    }, []);

    // ── Handle input changes ──
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setUserQuery(value);
        setActiveIndex(-1);
        fetchSuggestions(value);
    };

    // ── Navigate to search page ──
    const handleSearch = (query) => {
        const q = (query || searchQuery).trim();
        if (q) {
            setShowDropdown(false);
            setSuggestions([]);
            navigate(`/search?q=${encodeURIComponent(q)}`);
            inputRef.current?.blur();
        }
    };

    // ── Navigate to product detail ──
    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowDropdown(false);
        setSuggestions([]);
        navigate(`/product/${suggestion.id}`);
        inputRef.current?.blur();
    };

    // ── Keyboard navigation ──
    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) {
            if (e.key === 'Enter') handleSearch();
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => {
                    const next = prev < suggestions.length - 1 ? prev + 1 : 0;
                    setSearchQuery(suggestions[next].title);
                    return next;
                });
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => {
                    if (prev <= 0) {
                        // Go back to user's original query
                        setSearchQuery(userQuery);
                        return -1;
                    }
                    const next = prev - 1;
                    setSearchQuery(suggestions[next].title);
                    return next;
                });
                break;

            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < suggestions.length) {
                    handleSelectSuggestion(suggestions[activeIndex]);
                } else {
                    handleSearch();
                }
                break;

            case 'Escape':
                setShowDropdown(false);
                setActiveIndex(-1);
                setSearchQuery(userQuery);
                inputRef.current?.blur();
                break;

            default:
                break;
        }
    };

    // ── Scroll active item into view ──
    useEffect(() => {
        if (activeIndex >= 0 && dropdownRef.current) {
            const items = dropdownRef.current.querySelectorAll('[data-suggestion]');
            if (items[activeIndex]) {
                items[activeIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex]);

    // ── Close dropdown on outside click ──
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white sticky top-0 z-50 px-2 sm:px-6 lg:px-10 shadow-sm md:shadow-none">
            <div className="max-w-7xl mx-auto">
                {/* Mobile View (< md) */}
                <div className="md:hidden flex flex-col gap-3 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#212121]">
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Link to="/" className="flex items-center gap-1.5 bg-[#ffe500] hover:bg-[#f7db00] transition rounded-xl px-3 py-1 focus:outline-none">
                                <img src="/flipkart-logo.webp" alt="f" className="w-5 h-5 object-contain" />
                                <span className="text-sm font-semibold italic text-black tracking-tight">Flipkart</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/orders" className="text-[#212121]">
                                <img src="/orders-icon.svg" alt="orders" className="w-5 h-5 opacity-80" />
                            </Link>
                            <Link to="/cart" className="relative">
                                <img src="/cart-icon.svg" alt="cart" className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-[#ff6161] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                    {/* Search row on mobile */}
                    <div className="relative">
                        <button
                            onClick={() => handleSearch()}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717478]"
                        >
                            <Search size={18} strokeWidth={2.2} />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowDropdown(true);
                            }}
                            placeholder="Search for Products, Brands and More"
                            className="w-full h-10 pl-10 pr-4 text-sm bg-[#f0f5ff] rounded-lg outline-none placeholder-[#717478]"
                            autoComplete="off"
                        />
                        {/* Suggestions Dropdown */}
                        {showDropdown && suggestions.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#e0e0e0] shadow-lg z-50 max-h-[300px] overflow-y-auto"
                            >
                                {suggestions.map((s, idx) => {
                                    const isActive = idx === activeIndex;
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={() => handleSelectSuggestion(s)}
                                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${isActive ? 'bg-[#f0f5ff]' : 'hover:bg-[#f0f5ff]'}`}
                                        >
                                            <div className="w-8 h-8 rounded-md shrink-0 bg-white flex items-center justify-center p-1">
                                                <img src={s.image} alt="" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-[#212121] truncate">{s.title}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop View (>= md) */}
                <div className="hidden md:block">
                    {/* Top Row */}
                    <div className="flex items-center justify-between h-12 mb-2 mt-1">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2 bg-[#ffe500] hover:bg-[#f7db00] transition rounded-xl px-4 py-1.5 focus:outline-none">
                                <img src="/flipkart-logo.webp" alt="f" className="w-6 h-6 object-contain" />
                                <span className="text-sm font-semibold italic text-black tracking-tight">Flipkart</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                            <img src="/location.png" alt="location" className="w-4 h-4" />
                            <span className="text-[#212121] font-bold truncate max-w-[220px]">
                                {profile?.address ? `${profile.address}, ${profile.city}` : 'Location not set'}
                            </span>
                            <button onClick={() => navigate('/profile')} className="text-[#2a55e5] font-medium flex items-center hover:underline font-bold">
                                Select delivery location
                                <ChevronRight size={18} className="mt-0.5" />
                            </button>
                        </div>
                    </div>

                    {/* Search Row */}
                    <div className="flex items-center gap-6 pb-3">
                        <div className="flex-1">
                            <div className="relative">
                                <button
                                    onClick={() => handleSearch()}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717478] hover:text-[#2a55e5] transition-colors z-10"
                                >
                                    <Search size={20} strokeWidth={2.2} />
                                </button>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (suggestions.length > 0) setShowDropdown(true);
                                    }}
                                    placeholder="Search for Products, Brands and More"
                                    className="w-full h-11 pl-10 pr-4 text-sm bg-[#f0f5ff] hover:bg-white focus:bg-white border focus:border-[#2a55e5] border-transparent rounded-xl outline-none placeholder-[#717478] transition-colors shadow-none focus:shadow-[0_0_0_1px_#2a55e5]"
                                    autoComplete="off"
                                />

                                {/* Suggestions Dropdown */}
                                {showDropdown && suggestions.length > 0 && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#e0e0e0] shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 max-h-[420px] overflow-y-auto"
                                    >
                                        {suggestions.map((s, idx) => {
                                            const isActive = idx === activeIndex;
                                            return (
                                                <div
                                                    key={s.id}
                                                    data-suggestion
                                                    onClick={() => handleSelectSuggestion(s)}
                                                    onMouseEnter={() => {
                                                        setActiveIndex(idx);
                                                        setSearchQuery(s.title);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setActiveIndex(-1);
                                                        setSearchQuery(userQuery);
                                                    }}
                                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${isActive ? 'bg-[#f0f5ff]' : 'hover:bg-[#f0f5ff]'
                                                        }`}
                                                >
                                                    <div className="w-10 h-10 rounded-md overflow-hidden border border-[#f0f0f0] shrink-0 bg-white flex items-center justify-center">
                                                        <img src={s.image} alt="" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm text-[#212121] truncate">{s.title}</div>
                                                        <div className="text-xs text-[#2a55e5]">in {s.category}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-7 shrink-0">
                            {/* User Account */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 py-2">
                                    <img src="/login-icon.svg" alt="user" className="w-6 h-6" />
                                    <span className="text-sm text-[#212121]">{profile.firstName || 'Login'}</span>
                                    <ChevronDown size={16} className="text-[#717478] group-hover:rotate-180 transition-transform duration-200" />
                                </button>
                                <div className="absolute top-full right-0 mt-0 w-56 bg-white rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e0e0e0] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="px-4 py-3 border-b border-[#f0f0f0]">
                                        <p className="text-sm font-medium text-[#212121]">Your Account</p>
                                    </div>
                                    <div className="py-1">
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#f5f5f5] transition-colors">
                                            <img src="/login-icon.svg" alt="profile" className="w-5 h-5 opacity-70" />
                                            My Profile
                                        </Link>
                                        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#f5f5f5] transition-colors">
                                            <Heart size={20} className="opacity-70" />
                                            My Wishlist
                                        </Link>
                                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#f5f5f5] transition-colors">
                                            <img src="/orders-icon.svg" alt="orders" className="w-5 h-5 opacity-70" />
                                            My Orders
                                        </Link>
                                        <div className="border-t border-[#f0f0f0] my-1"></div>
                                        <Link
                                            to="/"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                logout();
                                                navigate('/');
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#f5f5f5] transition-colors"
                                        >
                                            <img src="/Logout-icon.svg" alt="logout" className="w-5 h-5 opacity-70" />
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Cart */}
                            <Link to="/cart" className="flex items-center gap-2 py-2">
                                <div className="relative">
                                    <img src="/cart-icon.svg" alt="cart" className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-[#ff6161] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-[#212121]">Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-[#f0f0f0] shadow-lg z-50">
                        <div className="py-2">
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-[#212121] hover:bg-[#f5f5f5]" onClick={() => setMobileMenuOpen(false)}>
                                <img src="/login-icon.svg" alt="profile" className="w-5 h-5 opacity-70" />
                                My Profile
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-[#212121] hover:bg-[#f5f5f5]" onClick={() => setMobileMenuOpen(false)}>
                                <Heart size={20} className="opacity-70" />
                                My Wishlist
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-[#212121] hover:bg-[#f5f5f5]" onClick={() => setMobileMenuOpen(false)}>
                                <img src="/orders-icon.svg" alt="orders" className="w-5 h-5 opacity-70" />
                                My Orders
                            </Link>
                            <div className="border-t border-[#f0f0f0] my-1"></div>
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                    navigate('/');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#212121] hover:bg-[#f5f5f5]"
                            >
                                <img src="/Logout-icon.svg" alt="logout" className="w-5 h-5 opacity-70" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}