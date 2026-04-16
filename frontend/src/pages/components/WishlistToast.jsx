import React from 'react';
import { useCart } from '../../context/CartContext';

export default function WishlistToast() {
    const { wishlistToast } = useCart();

    if (!wishlistToast) return null;

    return (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] bg-[#212121] text-white px-6 py-3.5 rounded shadow-lg text-sm font-medium tracking-wide transition-opacity duration-300">
            Product added to the wishlist
        </div>
    );
}
