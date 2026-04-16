import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CART_KEY = 'flipkart_cart';
const ORDERS_KEY = 'flipkart_orders';
const WISHLIST_KEY = 'flipkart_wishlist';
const PROFILE_KEY = 'flipkart_profile';

const DEFAULT_PROFILE = {
    firstName: 'Jeevan',
    lastName: '',
    gender: '',
    email: 'jeevanv1997@gmail.com',
    mobile: '9618006235',
};

function loadJSON(key, fallback = []) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => loadJSON(CART_KEY));
    const [orders, setOrders] = useState(() => loadJSON(ORDERS_KEY));
    const [wishlistIds, setWishlistIds] = useState(() => loadJSON(WISHLIST_KEY));
    const [profile, setProfile] = useState(() => {
        try {
            const raw = localStorage.getItem(PROFILE_KEY);
            if (raw) {
                return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
            }
            return DEFAULT_PROFILE;
        } catch { return DEFAULT_PROFILE; }
    });

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    }, [wishlistIds]);

    useEffect(() => {
        // Only persist when profile has meaningful data
        if (profile.firstName || profile.email || profile.mobile) {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        }
    }, [profile]);

    const updateProfile = useCallback((updates) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    }, []);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = useCallback((productId, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => String(i.productId) === String(productId));
            if (existing) {
                return prev.map((i) =>
                    String(i.productId) === String(productId)
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { productId: String(productId), quantity }];
        });

        // Also sync to backend (fire-and-forget)
        fetch(`${API}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: String(productId), quantity }),
        }).catch(() => { });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((i) =>
                String(i.productId) === String(productId) ? { ...i, quantity } : i
            )
        );
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((prev) => prev.filter((i) => String(i.productId) !== String(productId)));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const placeOrder = useCallback(async (shippingAddress) => {
        if (cartItems.length === 0) return null;

        // Get email from profile (backed by localStorage) for order confirmation
        const email = profile.email || '';

        try {
            const res = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingAddress, cartItems, email }),
            });
            const data = await res.json();

            if (data.success) {
                setOrders((prev) => [data.order, ...prev]);
                clearCart();
                return data.order;
            }
        } catch {
            // Fallback: create order locally
            const orderId = 'OD' + Date.now() + Math.floor(Math.random() * 1000);
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5);

            const order = {
                orderId,
                items: cartItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })),
                shippingAddress,
                status: 'confirmed',
                orderDate: new Date().toISOString(),
                estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short',
                }),
            };
            setOrders((prev) => [order, ...prev]);
            clearCart();
            return order;
        }
        return null;
    }, [cartItems, clearCart, profile]);

    const toggleWishlist = useCallback((productId) => {
        const pid = String(productId);
        setWishlistIds((prev) => {
            if (prev.includes(pid)) return prev.filter((id) => id !== pid);
            return [...prev, pid];
        });
    }, []);

    const logout = useCallback(() => {
        setCartItems([]);
        setOrders([]);
        setWishlistIds([]);
        setProfile(DEFAULT_PROFILE);
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(ORDERS_KEY);
        localStorage.removeItem(WISHLIST_KEY);
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem('flipkart_user_name'); // Clear if still exists
    }, []);

    const isInWishlist = useCallback((productId) => {
        return wishlistIds.includes(String(productId));
    }, [wishlistIds]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                orders,
                wishlistIds,
                profile,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                placeOrder,
                toggleWishlist,
                isInWishlist,
                updateProfile,
                logout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}