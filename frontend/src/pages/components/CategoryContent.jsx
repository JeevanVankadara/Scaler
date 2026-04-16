import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BestGadgets from './BestGadgets';
import { cachedFetch } from '../../utils/apiCache';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Client-side cache: survives across navigations ──
// Removed in favor of apiCache


const categoryMeta = {
    fashion: { name: 'Fashion', bg: '#fff3e0' },
    mobiles: { name: 'Mobiles', bg: '#e3f2fd' },
    beauty: { name: 'Beauty', bg: '#fce4ec' },
    electronics: { name: 'Electronics', bg: '#e8f5e9' },
    home: { name: 'Home', bg: '#ede7f6' },
    appliances: { name: 'Appliances', bg: '#e0f2f1' },
    toys: { name: 'Toys, baby products', bg: '#fff8e1' },
    food: { name: 'Food & Healthcare', bg: '#fce4ec' },
    sports: { name: 'Sports & Fitness', bg: '#e8f5e9' },
    books: { name: 'Books & More', bg: '#f3e5f5' },
    furniture: { name: 'Furniture', bg: '#e3f2fd' },
};

export default function CategoryContent({ category }) {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const [isHover, setIsHover] = useState(false);

    // Home page data
    const [banners, setBanners] = useState([]);
    const [homeSections, setHomeSections] = useState([]);
    const [homeLoading, setHomeLoading] = useState(false);

    // Category data
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [catLoading, setCatLoading] = useState(false);

    // Mouse drag state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);
    const dragDistance = useRef(0);

    // Fetch home data (with client cache)
    useEffect(() => {
        setHomeLoading(true);
        cachedFetch(`${API}/products/home`)
            .then((data) => {
                if (data.success) {
                    const b = data.banners || [];
                    const s = data.homeSections || [];
                    setBanners(b);
                    setHomeSections(s);
                }
            })
            .catch(() => {
                setBanners(['/posters/AC.webp', '/posters/speakers.webp', '/posters/Samsung-phone.webp', '/posters/watches.webp']);
            })
            .finally(() => setHomeLoading(false));
    }, [category]);

    // Fetch category products (with client cache)
    useEffect(() => {
        if (category === 'for-you') return;

        setCatLoading(true);
        cachedFetch(`${API}/products/category/${category}`)
            .then((data) => {
                if (data.success) {
                    setCategoryProducts(data.products || []);
                }
            })
            .catch(() => setCategoryProducts([]))
            .finally(() => setCatLoading(false));
    }, [category]);

    const posters = banners.length > 0 ? banners : [
        '/posters/AC.webp', '/posters/speakers.webp', '/posters/Samsung-phone.webp', '/posters/watches.webp',
    ];

    const getItemWidth = useCallback(() => {
        const el = containerRef.current;
        if (!el || !el.children[0]) return 300;
        return el.children[0].offsetWidth + 16;
    }, []);

    const scrollToSlide = useCallback((index) => {
        const el = containerRef.current;
        if (!el) return;
        const itemWidth = getItemWidth();
        el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        setCurrent(index);
    }, [getItemWidth]);

    useEffect(() => {
        if (isHover || posters.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => {
                const next = (prev + 1) % posters.length;
                scrollToSlide(next);
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, [isHover, category, posters.length, scrollToSlide]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onScroll = () => {
            if (isDragging.current) return;
            const itemWidth = getItemWidth();
            const idx = Math.round(el.scrollLeft / itemWidth);
            setCurrent(Math.min(idx, posters.length - 1));
        };
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [posters.length, getItemWidth]);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        dragDistance.current = 0;
        startX.current = e.pageX;
        scrollStart.current = containerRef.current.scrollLeft;
        containerRef.current.style.scrollBehavior = 'auto';
        containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const dx = e.pageX - startX.current;
        dragDistance.current = Math.abs(dx);
        containerRef.current.scrollLeft = scrollStart.current - dx;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        containerRef.current.style.scrollBehavior = 'smooth';
        containerRef.current.style.cursor = 'grab';
        const itemWidth = getItemWidth();
        const idx = Math.round(containerRef.current.scrollLeft / itemWidth);
        const clamped = Math.max(0, Math.min(idx, posters.length - 1));
        scrollToSlide(clamped);
    };

    const handleMouseLeave = () => {
        if (isDragging.current) handleMouseUp();
        setIsHover(false);
    };

    // ── Shared Banner Carousel ──
    const bannerCarousel = (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <div
                className="relative"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={containerRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pt-4 pb-2
             [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{ cursor: 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {posters.map((src, i) => (
                        <div
                            key={i}
                            className="snap-start shrink-0 cursor-pointer w-[85%] sm:w-[calc((100%-2rem)/2.35)]"
                        >
                            <img
                                src={src}
                                alt={`banner-${i}`}
                                loading="lazy"
                                className="w-full h-32 sm:h-48 lg:h-56 object-cover rounded-xl select-none pointer-events-none"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-1.5 pb-3 pt-1">
                    {posters.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToSlide(i)}
                            className={`transition-all duration-300 h-1.5 rounded-full ${current === i ? 'w-5 bg-[#717478]' : 'w-1.5 bg-[#d1d5db] hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    // ── Other categories ──
    if (category !== 'for-you') {
        const meta = categoryMeta[category] || { name: category, bg: '#f5f5f5' };

        if (catLoading) {
            return (
                <div className="space-y-4">
                    {bannerCarousel}
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-40 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (categoryProducts.length === 0) {
            return (
                <div className="space-y-4">
                    {bannerCarousel}
                    <div className="bg-white rounded-sm shadow-sm min-h-64 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-xl font-medium">{meta.name}</h2>
                            <p className="text-gray-500 mt-1">No products found in this category</p>
                            <button
                                onClick={() => navigate(`/search?category=${category}`)}
                                className="mt-3 text-[#2874f0] text-sm font-medium hover:underline"
                            >
                                Browse all products →
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Chunk products into groups of 4
        const chunks = [];
        for (let i = 0; i < categoryProducts.length; i += 4) {
            chunks.push(categoryProducts.slice(i, i + 4));
        }

        return (
            <div className="space-y-4">
                {bannerCarousel}
                {chunks.map((chunk, idx) => (
                    <BestGadgets
                        key={idx}
                        title={idx === 0 ? `${meta.name} — Top Deals` : `More in ${meta.name}`}
                        bgColor={meta.bg}
                        categoryId={category}
                        items={chunk.map((p) => ({
                            id: p.id,
                            title: p.title,
                            subtitle: p.discountLabel || `₹${p.price.toLocaleString('en-IN')}`,
                            img: p.images?.[0] || '/product-photos/earphones.webp',
                        }))}
                    />
                ))}
            </div>
        );
    }

    // ── For You (Home) ──
    return (
        <div>
            {bannerCarousel}

            {/* Product Sections from API */}
            {homeLoading ? (
                <div className="space-y-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="h-40 bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : homeSections.length > 0 ? (
                homeSections.map((section, idx) => (
                    <BestGadgets
                        key={idx}
                        title={section.title}
                        bgColor={section.bgColor}
                        categoryId={section.categoryId}
                        items={(section.products || []).slice(0, 4).map((p) => ({
                            id: p.id,
                            title: p.title,
                            subtitle: p.discountLabel || `₹${p.price.toLocaleString('en-IN')}`,
                            img: p.images?.[0] || '/product-photos/earphones.webp',
                        }))}
                    />
                ))
            ) : (
                <>
                    <BestGadgets title="Best Gadgets & Appliances" bgColor="#ede7f6" categoryId="electronics" />
                    <BestGadgets title="Top Electronics" bgColor="#e8f5e9" categoryId="electronics" />
                    <BestGadgets title="Fashion Top Deals" bgColor="#fff3e0" categoryId="fashion" />
                    <BestGadgets title="Beauty, Food & More" bgColor="#fce4ec" categoryId="beauty" />
                    <BestGadgets title="Home & Furniture" bgColor="#e3f2fd" categoryId="home" />
                </>
            )}
        </div>
    );
}