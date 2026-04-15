import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CART_KEY = 'flipkart_cart';
const ORDERS_KEY = 'flipkart_orders';

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

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }, [orders]);

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

        try {
            const res = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingAddress, cartItems }),
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
    }, [cartItems, clearCart]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                orders,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                placeOrder,
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