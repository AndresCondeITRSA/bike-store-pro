"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Database } from "@/types/database";

type Bike = Database["public"]["Tables"]["bikes"]["Row"];

export interface CartItem {
  bike: Bike;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (bike: Bike) => void;
  removeFromCart: (bikeId: string) => void;
  updateQuantity: (bikeId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (bike: Bike) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.bike.id === bike.id);
      if (existing) {
        return prev.map((item) =>
          item.bike.id === bike.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { bike, quantity: 1 }];
    });
  };

  const removeFromCart = (bikeId: string) => {
    setItems((prev) => prev.filter((item) => item.bike.id !== bikeId));
  };

  const updateQuantity = (bikeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bikeId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.bike.id === bikeId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.bike.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
