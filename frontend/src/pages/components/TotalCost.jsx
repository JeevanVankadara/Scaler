export default function TotalCost() {
    return (
        <div className="bg-white shadow-sm">
            {/* Header */}
            <div className="px-5 py-3.5 border-b">
                <h2 className="text-xs font-medium text-[#878787] uppercase tracking-wide">Price Details</h2>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#212121]">Price (2 items)</span>
                        <span className="text-[#212121]">₹1,428</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#212121]">Discount</span>
                        <span className="text-[#388e3c]">− ₹839</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#212121]">Fees</span>
                        <span className="text-[#212121]">₹7</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#212121]">Delivery Charges</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[#878787] line-through text-xs">₹80</span>
                            <span className="text-[#388e3c]">Free</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-[#e0e0e0] my-3"></div>

                    <div className="flex justify-between text-base font-medium">
                        <span className="text-[#212121]">Total Amount</span>
                        <span className="text-[#212121]">₹596</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-[#e0e0e0] my-3"></div>

                <div className="bg-[#e8f5e9] rounded-sm px-3 py-2.5 text-sm text-[#388e3c] font-medium flex items-center gap-1.5">
                    <img src="/save-image.webp" alt="save" className="w-4 h-4" /> You'll save ₹839 on this order!
                </div>

                {/* Place Order section */}
                <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-[#878787] line-through">₹1,428</p>
                        <p className="text-lg font-medium text-[#212121]">₹596 <span className="text-xs text-[#878787] font-normal">ⓘ</span></p>
                    </div>
                    <button className="bg-[#fb641b] hover:bg-[#f55a0e] text-white font-medium px-8 py-2.5 text-sm rounded-sm shadow-sm">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}