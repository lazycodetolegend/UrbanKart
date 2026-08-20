import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/wishlist');
      setWishlistItems(data.wishlist || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to update wishlist');
      return;
    }
    
    try {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      setWishlistItems(data.wishlist || []);
      const isAdded = data.wishlist.some(item => item._id === productId);
      if (isAdded) {
        toast.success('Added to wishlist');
      } else {
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
