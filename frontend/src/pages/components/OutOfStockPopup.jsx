import { X, AlertTriangle } from 'lucide-react';

export default function OutOfStockPopup({ isOpen, onClose, productName, availableStock }) {
    if (!isOpen) return null;

    const isFullyOut = !availableStock || availableStock <= 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.2)] w-full max-w-md mx-4 overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                {/* Header */}
                <div className="bg-[#fff8e1] px-5 py-4 flex items-center gap-3 border-b border-[#ffe082]">
                    <div className="w-10 h-10 rounded-full bg-[#ff9800] flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-[#212121]">
                            {isFullyOut ? 'Out of Stock' : 'Stock Limit Reached'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center transition-colors"
                    >
                        <X size={18} className="text-[#878787]" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5">
                    <p className="text-sm text-[#212121] leading-relaxed">
                        {isFullyOut ? (
                            <>
                                <span className="font-medium">{productName}</span> is currently
                                <span className="text-[#ff6161] font-semibold"> out of stock</span>.
                                Please check back later or explore similar products.
                            </>
                        ) : (
                            <>
                                Only <span className="text-[#ff6161] font-semibold">{availableStock} item{availableStock > 1 ? 's' : ''}</span> of
                                {' '}<span className="font-medium">{productName}</span> {availableStock > 1 ? 'are' : 'is'} available.
                                You cannot add more than the available quantity.
                            </>
                        )}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[#f0f0f0] flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#2874f0] hover:bg-[#1a5ed8] text-white text-sm font-medium px-8 py-2.5 rounded-sm transition-colors"
                    >
                        OK, Got It
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
