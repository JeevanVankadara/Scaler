import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Heart, MapPin, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductGallery from './components/ProductGallery';
import StickyBuyBar from './components/StickyBuyBar';
import SimilarProducts from './components/SimilarProducts';
import OutOfStockPopup from './components/OutOfStockPopup';
import { cachedFetch } from '../utils/apiCache';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatPrice(value) {
    return `Rs. ${value.toLocaleString('en-IN')}`;
}

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, isInWishlist, profile } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [stockPopup, setStockPopup] = useState({ open: false, name: '', stock: 0 });

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        cachedFetch(`${API}/products/${id}`)
            .then((data) => {
                if (data.success && data.product) {
                    setProduct(data.product);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);



    const handleAddToCart = () => {
        addToCart(product.id);
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (product.stock <= 0) return;
        addToCart(product.id);
        navigate('/checkout');
    };

    const getDeliveryDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
                <NavBar />
                <main className="flex-1 max-w-[1440px] mx-auto w-full px-3 py-3 lg:px-4 lg:py-5">
                    <div className="bg-white border border-[#ebebeb] p-6 flex flex-col lg:flex-row gap-8 animate-pulse">
                        <div className="flex-1 h-[400px] bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg text-[#212121]">Product not found</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 bg-[#2874f0] text-white px-8 py-2.5 rounded-sm text-sm font-medium"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const displayPrice = product.price;
    const displayOriginal = product.originalPrice;
    const displayDiscount = product.discountLabel;

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1440px] mx-auto px-3 py-3 lg:px-4 lg:py-5">
                    <div className="bg-white border border-[#ebebeb]">
                        {/* Breadcrumb */}
                        <div className="px-4 py-3 text-xs text-[#878787] flex flex-wrap items-center gap-1.5 border-b border-[#f0f0f0]">
                            <span className="hover:text-[#2874f0] cursor-pointer" onClick={() => navigate('/')}>Home</span>
                            <ChevronRight size={14} />
                            <span className="hover:text-[#2874f0] cursor-pointer"
                                onClick={() => navigate(`/search?category=${product.categoryId}`)}>
                                {product.category}
                            </span>
                            <ChevronRight size={14} />
                            <span className="text-[#212121]">{product.title.split(' ').slice(0, 4).join(' ')}</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,500px)] gap-8 px-4 py-5 lg:px-6 lg:py-6">
                            {/* Left — Gallery */}
                            <div>
                                <ProductGallery images={product.images} productName={product.title} />
                            </div>

                            {/* Right — Product Info */}
                            <div className="min-h-0">
                                <div className="flex flex-col h-full lg:max-h-[calc(100vh-140px)]">
                                    <div className="flex-1 lg:overflow-y-auto pr-1 lg:pr-3 space-y-5">



                                        {/* Title & Rating */}
                                        <section>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#2874f0] text-sm font-semibold">Visit {product.brand} store</span>
                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                                >
                                                    <Heart size={22} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                                                </button>
                                            </div>
                                            <h1 className="mt-2 text-[24px] lg:text-[30px] leading-[1.3] font-normal text-[#212121]">
                                                {product.title}
                                            </h1>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="bg-[#388e3c] text-white text-sm px-2 py-1 rounded-md flex items-center gap-1 font-semibold">
                                                    {product.rating} <Star size={14} fill="white" strokeWidth={1.5} />
                                                </span>
                                                <span className="text-[#878787] text-[15px]">{product.reviews}</span>
                                                {product.fAssured && (
                                                    <img
                                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                                                        className="h-5"
                                                        alt="Assured"
                                                    />
                                                )}
                                            </div>
                                        </section>

                                        {/* Price */}
                                        <section>
                                            <span className="inline-flex bg-[#008c48] text-white text-sm font-semibold px-3 py-1 rounded-md">
                                                Hot Deal
                                            </span>
                                            {product.stock <= 0 ? (
                                                <div className="mt-5">
                                                    <span className="text-[#c2217c] text-[24px] font-medium">Currently unavailable</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mt-4 flex items-baseline gap-3 flex-wrap">
                                                        <span className="text-[#008c48] text-[19px] lg:text-[22px] font-semibold">{displayDiscount}</span>
                                                        <span className="text-[#878787] text-[22px] lg:text-[24px] line-through">{formatPrice(displayOriginal)}</span>
                                                        <span className="text-[#212121] text-[38px] lg:text-[46px] leading-none font-semibold">{formatPrice(displayPrice)}</span>
                                                    </div>
                                                    {product.exchangeValue > 0 && (
                                                        <p className="mt-3 text-[15px] text-[#5f6368]">
                                                            Upto {formatPrice(product.exchangeValue)} Off on Exchange
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </section>

                                        {/* Delivery Details */}
                                        <section>
                                            <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#212121] mb-4">Delivery details</h2>
                                            <div className="overflow-hidden rounded-2xl border border-[#ebebeb] bg-white">
                                                <div className="bg-[#f0f7ff] px-4 py-4 flex flex-wrap items-center gap-2 text-[15px]">
                                                    <MapPin size={16} className="text-[#5f6368]" />
                                                    <span className="font-medium text-[#212121]">
                                                        {profile?.address ? `${profile.address}, ${profile.city}` : 'Location not set'}
                                                    </span>
                                                    <button type="button" className="text-[#2874f0] font-semibold">Select delivery location</button>
                                                </div>
                                                <div className="px-4 py-4 border-t border-[#f0f0f0] bg-[#fafafa]">
                                                    <div className="flex items-center gap-2 font-semibold text-[#212121]">
                                                        <Truck size={18} />
                                                        <span>Delivery by {getDeliveryDate()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Highlights */}
                                        {product.highlights?.length > 0 && (
                                            <section>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#212121]">Product highlights</h2>
                                                    <ChevronDown size={18} className="text-[#5f6368] rotate-180" />
                                                </div>
                                                <div className="space-y-4">
                                                    {product.highlights.map((highlight) => (
                                                        <div key={highlight} className="flex items-start gap-3 text-[16px] text-[#212121]">
                                                            <span className="mt-1 text-[#5f6368]">•</span>
                                                            <span>{highlight}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Description */}
                                        {product.description?.length > 0 && (
                                            <section>
                                                <h2 className="text-[16px] lg:text-[18px] font-semibold text-[#212121] mb-2">Description</h2>
                                                <div className="space-y-1.5 text-[13px] leading-5 text-[#212121]">
                                                    {product.description.map((p, i) => (
                                                        <p key={i}>{p}</p>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        <div className="h-6" />
                                    </div>

                                    <div className="mt-4" />
                                    <StickyBuyBar
                                        price={displayPrice}
                                        onAddToCart={handleAddToCart}
                                        onBuyNow={handleBuyNow}
                                        isOutOfStock={product.stock <= 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <SimilarProducts productId={product.id} />
                </div>
            </main>

            <Footer />

            <OutOfStockPopup
                isOpen={stockPopup.open}
                onClose={() => setStockPopup({ open: false, name: '', stock: 0 })}
                productName={stockPopup.name}
                availableStock={stockPopup.stock}
            />
        </div>
    );
}