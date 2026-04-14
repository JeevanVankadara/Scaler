export default function OrderFilters() {
    return (
        <div className="bg-white shadow-sm rounded-md">
            <div className="px-4 py-3">
                <h2 className="text-lg font-medium text-[#212121]">Filters</h2>
            </div>

            {/* Order Status */}
            <div className="px-4 py-4">
                <h3 className="text-xs font-medium text-[#212121] uppercase mb-3">Order Status</h3>
                <div className="space-y-3">
                    {['On the way', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 border-2 border-[#c2c2c2] rounded accent-[#2874f0]" />
                            <span className="text-sm text-[#212121]">{s}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Order Time */}
            <div className="px-4 py-4">
                <h3 className="text-xs font-medium text-[#212121] uppercase mb-3">Order Time</h3>
                <div className="space-y-3">
                    {['Last 30 days', '2024', '2023', 'Older'].map((t) => (
                        <label key={t} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 border-2 border-[#c2c2c2] rounded accent-[#2874f0]" />
                            <span className="text-sm text-[#212121]">{t}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}