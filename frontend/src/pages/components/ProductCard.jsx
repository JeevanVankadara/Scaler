import { Heart, Star } from 'lucide-react';

export default function ProductCard() {
    return (
        <div className="flex gap-6 p-4 border-b hover:shadow-sm transition-shadow bg-white cursor-pointer">
            {/* Left Image */}
            <div className="w-[180px] shrink-0 relative">
                <img
                    src="/product-photos/earphones.webp"
                    alt="Product"
                    className="w-full h-[200px] object-contain"
                />
                <button className="absolute top-0 right-0 text-gray-300 hover:text-red-400 transition-colors">
                    <Heart size={20} fill="transparent" />
                </button>
                <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-[#2874f0]" />
                    <span className="text-xs text-[#212121]">Add to Compare</span>
                </div>
            </div>

            {/* Middle Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-[#212121] hover:text-[#2874f0] mb-1.5">
                    POCO C85x (Elite Black, 64 GB)
                </h3>

                <div className="flex items-center gap-2 mb-2.5">
                    <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 font-medium">
                        4.2 <Star size={11} fill="white" />
                    </span>
                    <span className="text-xs text-[#878787] font-medium">473 Ratings & 21 Reviews</span>
                </div>

                <ul className="space-y-1 text-[13px] text-[#212121]">
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>4 GB RAM | 64 GB ROM | Expandable Upto 2 TB</li>
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>17.53 cm (6.9 inch) HD+ Display</li>
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>32MP Rear Camera</li>
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>6300 mAh Lithium-Ion Polymer Battery</li>
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>T8300 Processor</li>
                    <li className="flex gap-2"><span className="text-[#c2c2c2]">•</span>1 Year Manufacturer Warranty for Phone and 6 Months Warranty for In the Box Accessories</li>
                </ul>
            </div>

            {/* Right Price */}
            <div className="w-[170px] shrink-0">
                <div className="flex items-start gap-2 mb-1">
                    <span className="text-xl font-medium text-[#212121]">₹10,999</span>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" className="h-5 mt-1" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[#878787] line-through">₹13,499</span>
                    <span className="text-sm text-[#388e3c] font-medium">18% off</span>
                </div>
                <p className="text-xs text-[#212121]">Upto <span className="font-medium">₹7,450</span> Off on Exchange</p>
                <p className="text-xs text-[#388e3c] font-medium mt-0.5">Bank Offer</p>
            </div>
        </div>
    );
}