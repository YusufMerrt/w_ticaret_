"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export interface GuestCartItem {
    id: string; // generated unique id
    product_id: string;
    size: string;
    quantity: number;
    product_name: string;
    product_slug: string;
    product_price: number;
    product_discount_price: number | null;
    product_image: string | null;
}

interface CartContextType {
    items: GuestCartItem[];
    itemCount: number;
    total: number;
    addItem: (item: Omit<GuestCartItem, "id">) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    isReady: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "hg_butik_cart";

function generateId() {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function getStoredCart(): GuestCartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCart(items: GuestCartItem[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<GuestCartItem[]>([]);
    const [isReady, setIsReady] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = getStoredCart();
        setItems(stored);
        setIsReady(true);
    }, []);

    // Sync to localStorage whenever items change (after initial load)
    useEffect(() => {
        if (isReady) {
            saveCart(items);
            // Dispatch custom event so Header badge updates instantly
            window.dispatchEvent(new Event("cart-updated"));
        }
    }, [items, isReady]);

    const addItem = useCallback((newItem: Omit<GuestCartItem, "id">) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.product_id === newItem.product_id && item.size === newItem.size
            );
            if (existing) {
                return prev.map((item) =>
                    item.id === existing.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, { ...newItem, id: generateId() }];
        });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => {
        const price = item.product_discount_price || item.product_price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{ items, itemCount, total, addItem, updateQuantity, removeItem, clearCart, isReady }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
