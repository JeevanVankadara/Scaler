export default function OrderItem({ order }) {
    return (
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-md">
            <div className="p-4">
                {/* Shared order badge */}
                <div className="inline-block bg-[#fff7e6] text-[#212121] text-xs px-4 py-1.5 rounded-full mb-4">
                    Flipkart Customer shared this order with you.
                </div>

                <div className="flex items-start gap-5">
                    {/* Product image */}
                    <img
                        src={order.image}
                        alt={order.title}
                        className="w-[70px] h-[70px] object-contain shrink-0"
                    />

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer truncate">
                            {order.title}
                        </h3>
                        <div className="flex gap-3 mt-1.5 text-xs text-[#878787]">
                            <span>Color: {order.color}</span>
                            {order.size && <span>Size: {order.size}</span>}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="w-[80px] text-sm text-[#212121] shrink-0">
                        {order.price}
                    </div>

                    {/* Delivery status */}
                    <div className="w-[220px] shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-[#26a541] rounded-full inline-block"></span>
                            <span className="text-sm font-medium text-[#212121]">Delivered on {order.delivered}</span>
                        </div>
                        <p className="text-xs text-[#878787] mt-1 ml-[18px]">Your item has been delivered</p>
                    </div>
                </div>
            </div>
        </div>
    );
}