export default function OrderFilters({ statusFilter = [], onStatusChange = () => { } }) {
    const statuses = ['confirmed', 'delivered', 'cancelled', 'returned'];
    const timeFilters = ['Last 30 days', '2024', '2023', 'Older'];

    const toggleStatus = (s) => {
        if (statusFilter.includes(s)) {
            onStatusChange(statusFilter.filter((x) => x !== s));
        } else {
            onStatusChange([...statusFilter, s]);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-md">
            <div className="px-4 py-3">
                <h2 className="text-lg font-medium text-[#212121]">Filters</h2>
            </div>

            <div className="flex flex-row lg:flex-col border-t border-[#f0f0f0] lg:border-t-0">
                <div className="px-4 py-4 flex-1 border-r border-[#f0f0f0] lg:border-r-0">
                    <h3 className="text-xs font-medium text-[#212121] uppercase mb-3">Order Status</h3>
                    <div className="space-y-3">
                        {statuses.map((s) => (
                            <label key={s} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={statusFilter.includes(s)}
                                    onChange={() => toggleStatus(s)}
                                    className="w-4 h-4 border-2 border-[#c2c2c2] rounded accent-[#2874f0]"
                                />
                                <span className="text-sm text-[#212121] capitalize">{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="px-4 py-4 flex-1 lg:border-t lg:border-[#f0f0f0]">
                    <h3 className="text-xs font-medium text-[#212121] uppercase mb-3">Order Time</h3>
                    <div className="space-y-3">
                        {timeFilters.map((t) => (
                            <label key={t} className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 border-2 border-[#c2c2c2] rounded accent-[#2874f0]" />
                                <span className="text-sm text-[#212121]">{t}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}