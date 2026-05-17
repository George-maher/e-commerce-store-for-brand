import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(cart));
    } catch {
      // Silent fail for localStorage errors
    }
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      // Create a unique identifier that includes size if selected
      const uniqueId = product.selectedSize ? `${product.id}-${product.selectedSize}` : product.id;
      const idx = prev.findIndex((p) => {
        const cartUniqueId = p.selectedSize ? `${p.id}-${p.selectedSize}` : p.id;
        return cartUniqueId === uniqueId;
      });
      
      if (idx === -1) {
        return [...prev, { 
          id: product.id, 
          name: product.name, 
          price: Number(product.price), 
          quantity: 1,
          image: product.images ? product.images[0] : product.image,
          category: product.category,
          selectedSize: product.selectedSize || null
        }];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      return next;
    });
  }

  function removeFromCart(id, selectedSize = null) {
    setCart((prev) => prev.filter((p) => {
      const cartUniqueId = p.selectedSize ? `${p.id}-${p.selectedSize}` : p.id;
      const removeUniqueId = selectedSize ? `${id}-${selectedSize}` : id;
      return cartUniqueId !== removeUniqueId;
    }));
  }

  function updateQuantity(id, quantity, selectedSize = null) {
    setCart((prev) => prev.map((p) => {
      const cartUniqueId = p.selectedSize ? `${p.id}-${p.selectedSize}` : p.id;
      const updateUniqueId = selectedSize ? `${id}-${selectedSize}` : id;
      return cartUniqueId === updateUniqueId ? { ...p, quantity: Number(quantity) } : p;
    }));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { useCart };
export default CartContext;
