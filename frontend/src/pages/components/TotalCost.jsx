export default function TotalCost({
    itemCount = 0,
    subtotal = 0,
    discount = 0,
    deliveryCharge = 0,
    total = 0,
}) {
    return (
        <div className="bg-white shadow-sm">
            <div className="px-5 py-3.5 border-b">
                <h2 className="text-xs font-medium text-[#878787] uppercase tracking-wide">Price Details</h2>
            </div>

            <div className="px-5 py-4">
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#212121]">Price ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                        <span className="text-[#212121]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#212121]">Discount</span>
                        <span className="text-[#388e3c]">− ₹{discount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#212121]">Delivery Charges</span>
                        <div className="flex items-center gap-1.5">
                            {deliveryCharge === 0 ? (
                                <>
                                    <span className="text-[#878787] line-through text-xs">₹80</span>
                                    <span className="text-[#388e3c]">Free</span>
                                </>
                            ) : (
                                <span className="text-[#212121]">₹{deliveryCharge}</span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-dashed border-[#e0e0e0] my-3"></div>

                    <div className="flex justify-between text-base font-medium">
                        <span className="text-[#212121]">Total Amount</span>
                        <span className="text-[#212121]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-[#e0e0e0] my-3"></div>

                {discount > 0 && (
                    <div className="bg-[#e8f5e9] rounded-sm px-3 py-2.5 text-sm text-[#388e3c] font-medium flex items-center gap-1.5">
                        <img src="/save-image.webp" alt="save" className="w-4 h-4" />
                        You'll save ₹{discount.toLocaleString('en-IN')} on this order!
                    </div>
                )}
            </div>
        </div>
    );
}