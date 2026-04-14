import { ArrowRight } from 'lucide-react';

export default function BestGadgets({
    title = 'Best Gadgets & Appliances',
    bgColor = '#ede7f6',
    items = null,
}) {
    const defaultItems = [
        { title: 'True Wireless', subtitle: 'Special offer', img: '/product-photos/earphones.webp' },
        { title: 'Smart Watches', subtitle: 'Min. 40% Off', img: '/product-photos/watches.webp' },
        { title: 'Neckband', subtitle: 'Widest Range', img: '/product-photos/Neckbans.webp' },
        { title: 'Trimmers', subtitle: 'Min. 50% Off', img: '/product-photos/Pendrives.webp' },
    ];

    const data = items || defaultItems;

    return (
        <div className="mt-3">
            <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: bgColor }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-[18px] font-semibold text-[#212121]">
                        {title}
                    </h2>
                    <button className="bg-[#111] hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Inner white card */}
                <div className="bg-white rounded-xl p-3 sm:p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.map((item, i) => (
                            <div key={i} className="cursor-pointer group">
                                <div className="bg-[#f5f5f5] rounded-lg aspect-[4/3] flex items-center justify-center p-3 overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="mt-2 px-0.5">
                                    <p className="text-[13px] text-[#212121] leading-tight">{item.title}</p>
                                    <p className="text-[13px] font-bold text-[#212121] leading-tight">{item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}