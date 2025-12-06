import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaSpinner, 
  FaStar,
  FaShoppingCart,
  FaBolt
} from "react-icons/fa";
import { getAllProduct } from '../../../Services/Products'; // Adjust path
import { getCategory } from '../../../Services/Settings'; // Adjust path
import baseUrl from '../../../Static/Static';
import { useAuth } from '../../../Context/UserContext';
import { addTocart as addToCartService } from '../../../Services/userApi';
import ModernNavbar from '../../user/NavBar/NavBar'; // Adjust path to your navbar
import Footer from '../Footer/Footer'; // Adjust path to your footer
import Alert from '../Alert/Alert';
import Loader from '../../../Loader/Loader';

const ProductCard = React.memo(({ product, onAddToCart, onBuyNow, addingToCart }) => {
  const rating = product.rating_summary ? parseFloat(product.rating_summary.average_rating) || 0 : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalReviews = product.rating_summary ? product.rating_summary.total_reviews || 0 : 0;

  const navigateToDetails = useCallback((id) => {
    window.location.href = `/Details/${id}`;
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product.id, e);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    onBuyNow(product, e);
  };

  return (
    <div 
      key={product.id}
      onClick={() => navigateToDetails(product.id)}
      className="group flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative h-full"
    >
      {/* Red accent details - Responsive */}
      <div className="absolute top-0 left-0 w-0.5 lg:w-1 h-12 lg:h-16 bg-red-400"></div>
      <div className="absolute top-0 right-0 w-8 lg:w-12 h-0.5 bg-red-400"></div>
      <div className="absolute bottom-0 left-0 w-10 lg:w-16 h-0.5 bg-red-400"></div>

      {/* Image Container - Responsive height */}
      <div className="relative h-44 lg:h-56 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
        <img 
          src={product.images?.[0]?.image 
            ? baseUrl + product.images[0].image 
            : "https://pnghq.com/wp-content/uploads/pnghq.com-gaming-computer-picture-p-4.png"
          } 
          alt={product.name}
          className="h-32 lg:h-44 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {/* Red accent in image area - Responsive */}
        <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 w-1.5 lg:w-2 h-8 lg:h-10 bg-red-400"></div>
      </div>

      {/* Product Content - Responsive padding and text sizes, flex to align button at bottom */}
      <div className="flex-1 flex flex-col justify-between p-3 lg:p-5">
        <div>
          <h2 className="font-Roboto text-base lg:text-xl font-bold mb-3 lg:mb-4 line-clamp-2 leading-tight text-gray-900 text-center">
            {product.name}
          </h2>

          {/* Dynamic Rating - Centered */}
          <div className="flex items-center justify-center gap-1 lg:gap-1.5 mb-3 lg:mb-4">
            {[1,2,3,4,5].map((star) => {
              if (star <= fullStars) {
                return (
                  <FaStar 
                    key={star}
                    className={`text-sm lg:text-base text-yellow-400 fill-current`}
                  />
                );
              } else if (star === fullStars + 1 && hasHalfStar) {
                return (
                  <FaStar 
                    key={star}
                    className={`text-sm lg:text-base text-yellow-400 fill-current`}
                    style={{ clipPath: 'inset(0 50% 0 0)' }} // Simple half-star approximation
                  />
                );
              } else {
                return (
                  <FaStar 
                    key={star}
                    className={`text-sm lg:text-base text-gray-300`}
                  />
                );
              }
            })}
            <span className="text-sm lg:text-base ml-1 text-gray-600">
              ({rating.toFixed(1)}){totalReviews > 0 && ` (${totalReviews})`}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
            <span className="text-sm lg:text-base font-bold font-Roboto text-gray-900 whitespace-nowrap">
              ₹{product.price?.toLocaleString()}
            </span>
            <span className="text-xs lg:text-sm line-through text-gray-400 whitespace-nowrap">
              ₹{(product.price * 1.2)?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons - Responsive, side by side */}
        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart === product.id}
            className={`flex-1 py-1.5 lg:py-2 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm font-Roboto font-bold transition-all duration-300 ${
              addingToCart === product.id
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {addingToCart === product.id ? (
              <>
                <FaSpinner className="animate-spin text-xs lg:text-sm" /> 
                <span className="hidden lg:inline">Adding...</span>
                <span className="lg:hidden">Add</span>
              </>
            ) : (
              <>
                <FaShoppingCart className="text-xs lg:text-sm" /> 
                <span className="hidden lg:inline">Add to Cart</span>
                <span className="lg:hidden">Cart</span>
              </>
            )}
          </button>

          <button 
            onClick={handleBuyNowClick}
            className="flex-1 py-1.5 lg:py-2 text-xs lg:text-sm font-Roboto font-bold text-white flex items-center justify-center gap-1 lg:gap-2 bg-red-600 hover:bg-red-700 transition-all duration-300"
          >
            <FaBolt className="text-xs lg:text-sm" />
            <span className="hidden lg:inline">Buy Now</span>
            <span className="lg:hidden">Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || null;
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [guestCart, setGuestCart] = useState([]);
  const alertTimeoutRef = useRef(null);
  const { user } = useAuth();

  // Guest cart management functions (memoized for performance)
  const getGuestCart = useCallback(() => {
    try {
      const cart = sessionStorage.getItem('guestCart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((cartItems) => {
    try {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
      setGuestCart(cartItems);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, []);

  const addToGuestCart = useCallback((productId, product) => {
    const currentCart = getGuestCart();
    const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        productImage: product.images?.[0]?.image || null,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    saveGuestCart(currentCart);
    return currentCart;
  }, [getGuestCart, saveGuestCart]);

  const getGuestCartCount = useCallback(() => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  }, [guestCart]);

  // Initialize guest cart on component mount
  useEffect(() => {
    const initialCart = getGuestCart();
    setGuestCart(initialCart);
  }, [getGuestCart]);

  // Fetch data once on mount (optimized)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allProductsRes = await getAllProduct();
        const categoryRes = await getCategory();
        const productsData = Array.isArray(allProductsRes) ? allProductsRes : (allProductsRes.data || []);
        const categoriesData = Array.isArray(categoryRes) ? categoryRes : (categoryRes.data || []);
        
        // Pre-normalize data for faster filtering
        const normalizedProducts = productsData.map(p => ({
          ...p,
          nameLower: (p.name || '').toLowerCase(),
          brandLower: (p.brand || '').toLowerCase(),
          descriptionLower: (p.description || '').toLowerCase(),
          categoryLower: (p.category || '').toLowerCase()
        }));
        
        setAllProducts(normalizedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtering – recomputes only when deps change
  const memoizedFilteredProducts = useMemo(() => {
    if (loading || allProducts.length === 0) return [];

    let filtered = [...allProducts];

    // If no query and no categoryFilter, redirect to products or show all
    if (!query.trim() && !categoryFilter) {
      return allProducts; // Show all for now
    }

    // Apply category filter first if present
    if (categoryFilter) {
      filtered = filtered.filter(p => p.categoryLower === categoryFilter.toLowerCase());
    }

    // Apply query filter if present
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);

      // Check for category match: exact first, then partial includes
      let matchedCategory = categories.find(cat => 
        cat.name && cat.name.toLowerCase() === lowerQuery
      );
      if (!matchedCategory) {
        matchedCategory = categories.find(cat => 
          cat.name && cat.name.toLowerCase().includes(lowerQuery)
        );
      }

      if (matchedCategory && matchedCategory.name) {
        // Strong category match: filter only by this category
        filtered = filtered.filter(p => p.categoryLower === matchedCategory.name.toLowerCase());
      } else {
        // Product search: require all query words in at least one field
        if (queryWords.length === 0) return [];
        
        filtered = filtered.filter(p => {
          const nameMatch = queryWords.every(word => p.nameLower.includes(word));
          const brandMatch = queryWords.every(word => p.brandLower.includes(word));
          const descMatch = queryWords.every(word => p.descriptionLower.includes(word));
          const catMatch = p.categoryLower.includes(lowerQuery); // Partial on category

          return nameMatch || brandMatch || descMatch || catMatch;
        });
      }
    }

    // Limit results for performance (e.g., top 50)
    return filtered.slice(0, 50);
  }, [query, categoryFilter, allProducts, categories, loading]);

  // Update filteredProducts only when memoized value changes
  useEffect(() => {
    setFilteredProducts(memoizedFilteredProducts);
  }, [memoizedFilteredProducts]);

  // If no query, optionally redirect
  useEffect(() => {
    if (!query.trim() && !categoryFilter) {
      navigate('/products');
    }
  }, [query, categoryFilter, navigate]);

  const showAlert = useCallback((data) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    setAlertData(data);

    alertTimeoutRef.current = setTimeout(() => {
      setAlertData(null);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = useCallback(async (id, event) => {
    event.stopPropagation();
    
    try {
      setAddingToCart(id);
      
      if (!user) {
        const product = allProducts.find(p => p.id === id);
        if (product) {
          const updatedCart = addToGuestCart(id, product);
          
          const cartCount = getGuestCartCount();
          
          showAlert({
            type: "success",
            message: `Item added to cart! You have ${cartCount} item(s) in cart. Login to sync your cart.`,
            productId: id
          });
        }
      } else {
        let addToCart = await addToCartService(id);
        if (addToCart) {
          showAlert({
            type: "success",
            message: "Item successfully added to cart",
            productId: id
          });
        }
      }
    } catch (error) {
      console.log(error);
      showAlert({
        type: "error",
        message: `Failed to add to cart: ${error.message || "Unknown error"}`,
      });
    } finally {
      setAddingToCart(null);
    }
  }, [user, allProducts, addToGuestCart, getGuestCartCount, showAlert]);

  const handleBuyNow = useCallback((product, event) => {
    event.stopPropagation();
    
    if (!user) {
      addToGuestCart(product.id, product);
      showAlert({
        type: "info",
        message: "Please login to proceed with purchase"
      });
      
      setTimeout(() => {
        window.location.href = "/login"; // Fallback
      }, 2000);
    } else {
      console.log(product, "buy now product");
    }
  }, [user, addToGuestCart, showAlert]);

  if (loading) {
    return (
      <>
        <ModernNavbar />
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Navbar */}
      <ModernNavbar />

      {/* Main Content */}
      <div className="min-h-screen px-4 py-8 bg-white text-black">
        {alertData && (
          <Alert 
            type={alertData.type}
            message={alertData.message}
            productId={alertData.productId}
            error={alertData.error}
            onClose={() => setAlertData(null)}
          />
        )}

        <div className="w-full max-w-7xl mx-auto">
          {/* Dynamic Title Section */}
          <div className="text-center lg:text-left mb-6">
            <h1 className="text-3xl lg:text-5xl font-bold font-Roboto tracking-tight text-gray-900 relative inline-block">
              Search Results for "{query}" {categoryFilter ? `in ${categoryFilter}` : ''}
            </h1>
            <p className="mt-3 text-base text-gray-600">
              {filteredProducts.length} results found. Explore below.
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-6 border bg-gray-50 text-gray-600 border-gray-200 rounded-lg">
              <p className="text-lg font-semibold">No products found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  addingToCart={addingToCart}
                />
              ))}
            </div>
          )}
          {filteredProducts.length === 50 && (
            <p className="text-center mt-8 text-gray-600">
              Showing first 50 results. Refine your search for more.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default SearchResults;