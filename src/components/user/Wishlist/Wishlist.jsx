import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, X } from 'lucide-react';

// Define BaseURL safely outside component
const BaseURL = (() => {
  try {
    return require('../../../Static/Static').default || require('../../../Static/Static') || '';
  } catch (err) {
    console.error('Error loading BaseURL:', err);
    return process.env.REACT_APP_BASE_URL || '';
  }
})();

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        const parsed = JSON.parse(storedWishlist);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      const updatedWishlist = wishlist.filter(item => item.id !== id);
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setRemovingId(null);
    }, 300);
  };

  const clearWishlist = () => {
    if (window.confirm('Clear all items from wishlist?')) {
      setWishlist([]);
      localStorage.removeItem('wishlist');
    }
  };

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-lg mb-4 font-semibold text-gray-900">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Save items you love and shop them later</p>
          <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">Save your favorite items for later</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold">
                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
              </span>
              {wishlist.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors border border-gray-300 rounded-lg hover:border-red-300"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            if (!item || typeof item !== 'object') return null;
            
            const isRemoving = removingId === item.id;
            
            return (
              <article
                key={item.id}
                className={`group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 ${
                  isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-lg'
                }`}
              >
                {/* Image Container */}
                <div className="relative bg-gray-50 h-48 overflow-hidden">
                  {item.image ? (
                    <img
                      src={`${BaseURL}${item.image}`}
                      alt={item.name || 'Product'}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', `${BaseURL}${item.image}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-12 h-12 text-gray-300" strokeWidth={1} />
                    </div>
                  )}
                  
                  {/* Remove Button - Top Right */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
                    disabled={isRemoving}
                  >
                    <Trash2 className="w-4 h-4 text-gray-700 hover:text-red-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {item.name || 'Unnamed Product'}
                  </h3>

                  {/* Price - Visual Hierarchy */}
                  <div className="mb-3">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;