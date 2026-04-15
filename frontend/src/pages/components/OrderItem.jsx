import { useNavigate } from 'react-router-dom';

export default function OrderItem({ order }) {
    const navigate = useNavigate();

    const statusColor = {
        confirmed: '#2874f0',
        delivered: '#26a541',
        cancelled: '#ff6161',
        returned: '#878787',
    };

    const statusLabel = {
        confirmed: 'Order Confirmed',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned',
    };

    return (
        <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-md">
            <div className="p-4">
                {/* Order ID badge */}
                <div className="inline-block bg-[#f5f5f5] text-[#212121] text-xs px-4 py-1.5 rounded-full mb-4">
                    Order ID: {order.orderId}
                </div>

                {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-5 mb-3 last:mb-0">
                        <img
                            src={item.image || '/product-photos/earphones.webp'}
                            alt={item.title}
                            className="w-16 h-16 object-contain shrink-0 cursor-pointer"
                            onClick={() => item.productId && navigate(`/product/${item.productId}`)}
                        />
                        <div className="flex-1 min-w-0">
                            <h3
                                onClick={() => item.productId && navigate(`/product/${item.productId}`)}
                                className="text-sm text-[#212121] hover:text-[#2874f0] cursor-pointer truncate"
                            >
                                {item.title || `Product ${item.productId}`}
                            </h3>
                            <div className="flex gap-3 mt-1.5 text-xs text-[#878787]">
                                <span>Qty: {item.quantity}</span>
                                {item.price > 0 && <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>}
                            </div>
                        </div>

                        <div className="w-48 shrink-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full inline-block"
                                    style={{ backgroundColor: statusColor[order.status] || '#878787' }}
                                ></span>
                                <span className="text-sm font-medium text-[#212121]">
                                    {statusLabel[order.status] || order.status}
                                </span>
                            </div>
                            {order.estimatedDelivery && (
                                <p className="text-xs text-[#878787] mt-1 ml-4">
                                    {order.status === 'delivered' ? 'Delivered on' : 'Expected by'} {order.estimatedDelivery}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {order.total && (
                    <div className="border-t border-[#f0f0f0] pt-3 mt-3 flex justify-between items-center">
                        <span className="text-xs text-[#878787]">
                            Ordered on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                month: 'short', day: 'numeric', year: 'numeric'
                            })}
                        </span>
                        <span className="text-sm font-medium text-[#212121]">
                            Total: ₹{order.total.toLocaleString('en-IN')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}