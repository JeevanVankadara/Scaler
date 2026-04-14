import { useEffect, useRef, useState, useCallback } from 'react';

export default function CategoryContent({ category }) {
    // Posters from /public/posters - matches your folder
    const posters = [
        '/posters/AC.webp',
        '/posters/speakers.webp',
        '/posters/Samsung-phone.webp',
        '/posters/watches.webp',
    ];

    const containerRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const [isHover, setIsHover] = useState(false);

    // Mouse drag state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);
    const dragDistance = useRef(0);

    // Compute how wide each item is (including the gap)
    const getItemWidth = useCallback(() => {
        const el = containerRef.current;
        if (!el || !el.children[0]) return 300;
        return el.children[0].offsetWidth + 16; // 16px = gap-4
    }, []);

    // Scroll to a specific slide index
    const scrollToSlide = useCallback((index) => {
        const el = containerRef.current;
        if (!el) return;
        const itemWidth = getItemWidth();
        el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        setCurrent(index);
    }, [getItemWidth]);

    // Auto scroll every 4 seconds - cyclic
    useEffect(() => {
        if (category !== 'for-you' || isHover) return;

        const timer = setInterval(() => {
            setCurrent((prev) => {
                const next = (prev + 1) % posters.length;
                scrollToSlide(next);
                return next;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [isHover, category, posters.length, scrollToSlide]);

    // Update dots when user scrolls manually
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => {
            if (isDragging.current) return; // Don't update during drag
            const itemWidth = getItemWidth();
            const idx = Math.round(el.scrollLeft / itemWidth);
            setCurrent(Math.min(idx, posters.length - 1));
        };

        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, [posters.length, getItemWidth]);

    // ───── Mouse drag handlers ─────
    const handleMouseDown = (e) => {
        isDragging.current = true;
        dragDistance.current = 0;
        startX.current = e.pageX;
        scrollStart.current = containerRef.current.scrollLeft;
        containerRef.current.style.scrollBehavior = 'auto'; // instant feedback
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

        // Snap to nearest slide
        const itemWidth = getItemWidth();
        const idx = Math.round(containerRef.current.scrollLeft / itemWidth);
        const clamped = Math.max(0, Math.min(idx, posters.length - 1));
        scrollToSlide(clamped);
    };

    const handleMouseLeave = () => {
        if (isDragging.current) handleMouseUp();
        setIsHover(false);
    };

    // Other categories - simple placeholder for now
    if (category !== 'for-you') {
        const names = {
            fashion: 'Fashion', mobiles: 'Mobiles', beauty: 'Beauty',
            electronics: 'Electronics', home: 'Home', appliances: 'Appliances',
            toys: 'Toys, baby products', food: 'Food & Healthcare',
            auto: 'Auto Accessories', 'two-wheeler': '2 Wheelers',
            sports: 'Sports & Fitness', books: 'Books & More', furniture: 'Furniture'
        };
        return (
            <div className="bg-white rounded-sm shadow-sm min-h-64 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-medium">{names[category]} - section</h2>
                    <p className="text-gray-500 mt-1">Products will load here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Banner Carousel */}
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
                            className="snap-start shrink-0 cursor-pointer"
                            style={{ width: 'calc((100% - 2rem) / 2.35)' }}
                        >
                            <img
                                src={src}
                                alt={`banner-${i}`}
                                className="w-full h-56 object-cover rounded-xl select-none pointer-events-none"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center items-center gap-1.5 pb-3 pt-1">
                    {posters.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToSlide(i)}
                            className={`transition-all duration-300 h-1.5 rounded-full ${current === i
                                    ? 'w-5 bg-[#717478]'
                                    : 'w-1.5 bg-[#d1d5db] hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}