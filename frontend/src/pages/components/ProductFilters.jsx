import { useState } from 'react';
import { Search, ChevronUp } from 'lucide-react';

export default function ProductFilters({
    sortOrder = '',
    onSortChange = () => { },
    brands = [],
    selectedBrands = [],
    onBrandChange = () => { },
    minRating = 0,
    onRatingChange = () => { },
    maxPrice = 100000,
    onPriceChange = () => { },
}) {
    const [brandSearch, setBrandSearch] = useState('');

    const filteredBrands = brands.filter((b) =>
        b.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            onBrandChange(selectedBrands.filter((b) => b !== brand));
        } else {
            onBrandChange([...selectedBrands, brand]);
        }
    };

    return (
        <div className="bg-white shadow-sm w-full">
            <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-medium">Filters</h2>
            </div>

            {/* SORT BY */}
            <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-[#212121] uppercase">Sort By</h3>
                    <ChevronUp size={16} className="text-gray-500" />
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="sortOrder"
                            checked={sortOrder === 'low-high'}
                            onChange={() => onSortChange('low-high')}
                            className="w-4 h-4 accent-[#2874f0]"
                        />
                        <span className="text-sm text-[#212121]">Price -- Low to High</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="sortOrder"
                            checked={sortOrder === 'high-low'}
                            onChange={() => onSortChange('high-low')}
                            className="w-4 h-4 accent-[#2874f0]"
                        />
                        <span className="text-sm text-[#212121]">Price -- High to Low</span>
                    </label>
                </div>
            </div>

            {/* BRAND */}
            <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-[#212121] uppercase">Brand</h3>
                    <ChevronUp size={16} className="text-gray-500" />
                </div>
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-0 top-1.5 text-gray-400" />
                    <input
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        placeholder="Search Brand"
                        className="w-full border-b border-gray-300 pl-5 pb-1.5 text-sm outline-none focus:border-[#2874f0]"
                    />
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {filteredBrands.map((b) => (
                        <label key={b} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(b)}
                                onChange={() => toggleBrand(b)}
                                className="w-4 h-4 accent-[#2874f0] rounded border-gray-300"
                            />
                            <span className="text-sm text-[#212121]">{b}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* CUSTOMER RATINGS */}
            <div className="px-4 py-4 border-b">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-[#212121] uppercase">Customer Ratings</h3>
                    <ChevronUp size={16} className="text-gray-500" />
                </div>
                <div className="space-y-3">
                    {[4, 3, 2].map((star) => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={minRating === star}
                                onChange={() => onRatingChange(minRating === star ? 0 : star)}
                                className="w-4 h-4 accent-[#2874f0] rounded border-gray-300"
                            />
                            <span className="text-sm text-[#212121]">{star}★ & above</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* PRICE */}
            <div className="px-4 py-4">
                <h3 className="text-xs font-medium text-[#212121] uppercase mb-5">Price</h3>
                <div className="relative px-1 mb-6">
                    <div className="h-[3px] bg-[#e0e0e0] rounded-full relative">
                        <div
                            className="absolute h-[3px] bg-[#2874f0] rounded-full"
                            style={{ width: `${(maxPrice / 100000) * 100}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100000"
                        value={maxPrice}
                        onChange={(e) => onPriceChange(Number(e.target.value))}
                        className="absolute top-0 w-full h-4 opacity-0 cursor-pointer -mt-1.5"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <select className="w-full border border-gray-300 text-xs py-1.5 px-2 appearance-none bg-white rounded">
                            <option>Min</option>
                        </select>
                    </div>
                    <span className="text-gray-500 text-xs">to</span>
                    <div className="flex-1">
                        <select
                            value={maxPrice}
                            onChange={(e) => onPriceChange(Number(e.target.value))}
                            className="w-full border border-gray-300 text-xs py-1.5 px-2 appearance-none bg-white rounded"
                        >
                            <option value="100000">₹100000+</option>
                            <option value="50000">₹50000</option>
                            <option value="30000">₹30000</option>
                            <option value="20000">₹20000</option>
                            <option value="10000">₹10000</option>
                            <option value="5000">₹5000</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}