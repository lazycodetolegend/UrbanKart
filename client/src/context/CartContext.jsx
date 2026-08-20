import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('urbankart-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('urbankart-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        toast.success('Cart updated');
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: Math.min(item.qty + qty, item.stock) } : item
        );
      }
      toast.success('Added to cart');
      return [...prev, { ...product, qty: Math.min(qty, product.stock) }];
    });
  };

  const updateQty = (productId, qty) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    toast.success('Removed from cart');
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
