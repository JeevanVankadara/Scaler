import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Heart, Star, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AccountSidebar from './components/AccountSidebar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatPrice(value) {
    return `₹${value.toLocaleString('en-IN')}`;
}

export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlistIds, toggleWishlist, addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (wishlistIds.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`${API}/products/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: wishlistIds }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    // Maintain wishlist order
                    const map = {};
                    data.products.forEach((p) => (map[p.id] = p));
                    setProducts(wishlistIds.map((id) => map[id]).filter(Boolean));
                }
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [wishlistIds]);

    const handleMoveToCart = (product) => {
        addToCart(product.id);
        toggleWishlist(product.id);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1250px] mx-auto px-3.5 py-3">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-[#878787] mb-3">
                        <Link to="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
                        <ChevronRight size={14} />
                        <span className="hover:text-[#2874f0] cursor-pointer">My Account</span>
                        <ChevronRight size={14} />
                        <span className="text-[#212121]">My Wishlist</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Left Sidebar */}
                        <aside className="w-full lg:w-[250px] shrink-0">
                            <AccountSidebar />
                        </aside>
                        <div className="flex-1">
                    <div className="bg-white shadow-sm rounded-md">
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-medium text-[#212121]">My Wishlist ({wishlistIds.length})</h1>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="divide-y divide-[#f0f0f0]">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-5 p-5 animate-pulse">
                                        <div className="w-[112px] h-[112px] bg-gray-100 rounded-lg shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-100 rounded w-1/4" />
                                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16">
                                <Heart size={56} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-lg text-[#212121] font-medium">Your wishlist is empty</p>
                                <p className="text-sm text-[#878787] mt-1">Save items you love to your wishlist and find them here anytime</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-6 bg-[#2874f0] hover:bg-[#1c5ed8] text-white px-8 py-2.5 rounded-sm text-sm font-medium transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#f0f0f0]">
                                {products.map((product) => (
                                    <div key={product.id} className="flex gap-5 p-5 hover:bg-[#fafafa] transition-colors group">
                                        {/* Image */}
                                        <div
                                            className="w-[112px] h-[112px] shrink-0 flex items-center justify-center cursor-pointer"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            <img
                                                src={product.images?.[0] || '/product-photos/earphones.webp'}
                                                alt={product.title}
                                                loading="lazy"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer leading-5 line-clamp-2"
                                                onClick={() => navigate(`/product/${product.id}`)}
                                            >
                                                {product.title}
                                            </h3>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-medium">
                                                    {product.rating} <Star size={10} fill="white" />
                                                </span>
                                                <span className="text-xs text-[#878787]">{product.reviews}</span>
                                                {product.fAssured && (
                                                    <img
                                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                                        className="h-4"
                                                        alt="Assured"
                                                    />
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mt-2.5">
                                                <span className="text-lg font-medium text-[#212121]">{formatPrice(product.price)}</span>
                                                {product.originalPrice > product.price && (
                                                    <>
                                                        <span className="text-sm text-[#878787] line-through">{formatPrice(product.originalPrice)}</span>
                                                        <span className="text-sm text-[#388e3c] font-medium">{product.discountLabel}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 mt-4">
                                                <button
                                                    onClick={() => handleMoveToCart(product)}
                                                    className="bg-[#ff9f00] hover:bg-[#e89200] text-white text-sm font-medium px-6 py-2 rounded-sm transition-colors"
                                                >
                                                    MOVE TO CART
                                                </button>
                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className="flex items-center gap-1.5 text-sm text-[#878787] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                        </div>{/* end flex-1 */}
                    </div>{/* end flex row */}
                </div>
            </main>

            <Footer />
        </div>
    );
}
