const categories = [
    { id: 'for-you', label: 'For You', icon: '/small-components/For-you.svg' },
    { id: 'fashion', label: 'Fashion', icon: '/small-components/fashion.svg' },
    { id: 'mobiles', label: 'Mobiles', icon: '/small-components/mobiles.svg' },
    { id: 'beauty', label: 'Beauty', icon: '/small-components/beauty.svg' },
    { id: 'electronics', label: 'Electronics', icon: '/small-components/electronics.svg' },
    { id: 'home', label: 'Home', icon: '/small-components/home-final.svg' },
    { id: 'appliances', label: 'Appliances', icon: '/small-components/appliances.svg' },
    { id: 'toys', label: 'Toys, ba...', full: 'Toys, baby products', icon: '/small-components/toys.svg' },
    { id: 'food', label: 'Food & H...', full: 'Food & Healthcare', icon: '/small-components/food.svg' },
    { id: 'sports', label: 'Sports &...', full: 'Sports & Fitness', icon: '/small-components/sport.svg' },
    { id: 'books', label: 'Books &...', full: 'Books & More', icon: '/small-components/books.svg' },
    { id: 'furniture', label: 'Furniture', icon: '/small-components/furniture.svg' },
];

export default function CategoryNav({ selected, onSelect }) {
    return (
        <div className="bg-white px-10">
            <div className="max-w-7xl mx-auto px-2">
                {/* Inset top border */}
                <div className="border-t border-gray-200"></div>

                <div className="flex items-center justify-between overflow-x-auto">
                    {categories.map((cat) => {
                        const active = selected === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelect(cat.id)}
                                title={cat.full || cat.label}
                                className="relative flex flex-col items-center min-w-16 py-3 px-2 hover:bg-gray-50 transition-colors"
                            >
                                {/* icon with light blue bg when active */}
                                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${active ? 'bg-[#e7f0ff]' : ''}`}>
                                    <img src={cat.icon} alt={cat.label} className="w-8 h-8 object-contain" />
                                </div>

                                <span className={`mt-1.5 text-xs leading-tight whitespace-nowrap ${active ? 'font-semibold text-black' : 'text-[#212121]'}`}>
                                    {cat.label}
                                </span>

                                {/* blue underline - exactly like your screenshot */}
                                {active && (
                                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2a55e5] rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Inset bottom border */}
                <div className="border-b border-gray-200"></div>
            </div>
        </div>
    );
}