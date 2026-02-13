'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '../lib/products';
import { useAnalytics } from './AnalyticsContext';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalValue: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { track } = useAnalytics();

    const addToCart = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            const newItems = existing
                ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                : [...prev, { ...product, quantity: 1 }];

            // Calculate new total value for event
            const newTotalValue = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            track('add_to_cart', {
                product_id: product.id,
                category: product.category,
                price: product.price,
                quantity: 1,
                cart_value: newTotalValue
            });

            return newItems;
        });
    };

    const removeFromCart = (productId: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;

            const newItems = prev.filter(i => i.id !== productId);
            const newTotalValue = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            track('remove_from_cart', {
                product_id: item.id,
                category: item.category,
                price: item.price,
                quantity: item.quantity,
                cart_value: newTotalValue
            });

            return newItems;
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setItems(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;

            const newQty = Math.max(0, item.quantity + delta);
            const newItems = prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i).filter(i => i.quantity > 0);
            const newTotalValue = newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

            if (delta > 0) {
                track('add_to_cart', {
                    product_id: item.id,
                    category: item.category,
                    price: item.price,
                    quantity: delta,
                    cart_value: newTotalValue
                });
            } else if (delta < 0) {
                track('remove_from_cart', {
                    product_id: item.id,
                    category: item.category,
                    price: item.price,
                    quantity: Math.abs(delta),
                    cart_value: newTotalValue
                });
            }

            return newItems;
        });
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalValue
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
