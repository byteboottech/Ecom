import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaSpinner, 
  FaFilter, 
  FaSort,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaArrowDown,
  FaArrowUp,
  FaClock,
  FaTags
} from "react-icons/fa";
import { getAllProduct } from '../../../Services/Products';
import baseUrl from '../../../Static/Static';
import { useAuth } from '../../../Context/UserContext';
import { addTocart as addToCartService } from '../../../Services/userApi';
import Filter from '../Filter/Filter';
// import Sorting from '../Sorting/Sorting'; // Inlined for consistency
import Alert from '../Alert/Alert';
import Loader from '../../../Loader/Loader';

function CategoryProductList({ category }) { // Receives category as prop: { id, name } or null
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [currentSort, setCurrentSort] = useState(''); // Track current sort option
  const [guestCart, setGuestCart] = useState([]);
  const alertTimeoutRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  

  // Guest cart management functions
  const getGuestCart = () => {
    try {
      const cart = sessionStorage.getItem('guestCart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  };

  const saveGuestCart = (cartItems) => {
    try {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
      setGuestCart(cartItems);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const addToGuestCart = (productId, product) => {
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
  };

  const getGuestCartCount = () => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  };

  // Initialize guest cart on component mount
  useEffect(() => {
    const initialCart = getGuestCart();
    setGuestCart(initialCart);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let productData = await getAllProduct();
        
        // Filter API response based on category prop (using string name to match API structure)
        if (category && category.name) {
          console.log(`Filtering products for category name: "${category.name}"`);
          
          const categoryName = category.name.toLowerCase();

          productData = productData.filter(product =>
            categoryName.includes(product.category.toLowerCase()) ||
            product.category.toLowerCase().includes(categoryName)
          );
        }

        setProducts(productData || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // Re-run when category prop changes

  const showAlert = (data) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    setAlertData(data);

    alertTimeoutRef.current = setTimeout(() => {
      setAlertData(null);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const addTocart = async (id, event) => {
    event.stopPropagation();
    
    try {
      setAddingToCart(id);
      
      if (!user) {
        const product = products.find(p => p.id === id);
        if (product) {
          const updatedCart = addToGuestCart(id, product);
          console.log(updatedCart)
          
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
  };

const handleBuyNow = (product, event) => {
  event.stopPropagation(); // ⛔ prevent card click

  if (!user) {
    // Guest user → save product and go to login
    addToGuestCart(product.id, product);

    showAlert({
      type: "info",
      message: "Please login to continue with Buy Now"
    });

    navigate("/login");
  } else {
    // Logged-in user → go to Details page with Buy Now intent
    navigate(`/Details/${product.id}`, {
      state: {
        buyNow: true,
        quantity: 1
      }
    });
  }
};


  const navigateToDetails = (id) => {
    window.location.href = `/Details/${id}`; // Fallback without navigate
  };

  // Sorting functions
  const handleSort = (sortType) => {
    let sortedProducts = [...products];
    switch (sortType) {
      case 'highToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'lowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
        break;
      case 'category':
        sortedProducts.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
    setCurrentSort(sortType);
    setSort(false); // Close the sort panel after selection
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic header based on category prop
  const pageTitle = category ? `Products in ${category.name}` : "Featured Products";
  const pageSubtitle = category ? `Explore our ${category.name.toLowerCase()} collection` : "Discover our exclusive collection";

  return (
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
            {pageTitle}
          </h1>
          <p className="mt-3 text-base text-gray-600">
            {pageSubtitle}
          </p>
        </div>

        {/* Modern Heavy Header - Responsive row with wrap */}
        <div className="mb-6 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Modern Heavy Search Bar - Smaller on mobile, matching height */}
          <div className="relative flex-1 min-w-0 max-w-full sm:max-w-[28rem]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-8 pr-10 py-2
                  text-sm sm:text-base lg:text-lg
                  border-2 border-gray-200 rounded-lg
                  bg-white/80 backdrop-blur-sm
                  text-gray-900 placeholder-gray-500
                  outline-none transition-all duration-300
                  shadow-lg hover:shadow-xl
                  focus:border-red-500 focus:ring-4 focus:ring-red-100/50
                "
              />
              <FaSearch className="
                absolute left-2.5 top-1/2 -translate-y-1/2
                text-sm sm:text-lg lg:text-xl text-gray-400 transition-colors duration-300
                group-hover:text-red-500
              " />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <span>⌘</span><span>K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Redesigned Filter & Sort Buttons - Row on all sizes, icons only on mobile, smaller */}
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => { setFilter(!filter); if (sort) setSort(false); }}
              className="
                flex items-center justify-center p-2 sm:px-6 sm:py-3 text-sm font-semibold
                bg-white border-2 border-gray-200 rounded-lg shadow-md
                text-gray-700 hover:bg-red-50 hover:border-red-400 hover:shadow-lg
                transition-all duration-300 transform hover:-translate-y-0.5
                min-w-[44px] sm:min-w-[120px]
              "
            >
              <FaFilter className="text-sm sm:text-lg text-gray-600 hover:text-red-500 transition-colors" />
              <span className="hidden sm:inline ml-1.5">FILTER</span>
            </button>

            <button
              onClick={() => { setSort(!sort); if (filter) setFilter(false); }}
              className="
                flex items-center justify-center p-2 sm:px-6 sm:py-3 text-sm font-semibold
                bg-white border-2 border-gray-200 rounded-lg shadow-md
                text-gray-700 hover:bg-red-50 hover:border-red-400 hover:shadow-lg
                transition-all duration-300 transform hover:-translate-y-0.5
                min-w-[44px] sm:min-w-[120px]
              "
            >
              <FaSort className="text-sm sm:text-lg text-gray-600 hover:text-red-500 transition-colors" />
              <span className="hidden sm:inline ml-1.5">SORT</span>
            </button>
          </div>
        </div>

        {/* Filter Section - Less round */}
        {filter && (
          <div className="mb-6 p-4 sm:p-6 border bg-gray-50 border-gray-200 rounded-lg">
            <Filter products={products} setProducts={setProducts} />
          </div>
        )}

        {/* Redesigned Sort Section - Full width like filter, compact vertical space, added category option */}
        {sort && (
          <div className="mb-6 p-4 sm:p-6 border bg-gray-50 border-gray-200 rounded-lg">
            {/* Small red accent elements */}
            <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
            <div className="absolute bottom-0 right-0 w-1 h-4 bg-red-500"></div>
            <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center tracking-wide">Sort By</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3">
                {/* High to Low Button - Compact */}
                <button
                  onClick={() => handleSort('highToLow')}
                  className={`
                    flex flex-col items-center gap-1 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-md
                    transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-md
                    hover:-translate-y-0.5 group relative overflow-hidden
                    ${currentSort === 'highToLow' ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 group-hover:from-red-500/5 rounded-md transition-all"></div>
                  <div className={`p-0.5 sm:p-1 rounded-full ${currentSort === 'highToLow' ? 'bg-red-500' : 'bg-gray-200'} transition-colors`}>
                    <FaArrowDown className={`text-xs sm:text-sm ${currentSort === 'highToLow' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">High to Low</span>
                  {currentSort === 'highToLow' && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Low to High Button - Compact */}
                <button
                  onClick={() => handleSort('lowToHigh')}
                  className={`
                    flex flex-col items-center gap-1 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-md
                    transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-md
                    hover:-translate-y-0.5 group relative overflow-hidden
                    ${currentSort === 'lowToHigh' ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 group-hover:from-red-500/5 rounded-md transition-all"></div>
                  <div className={`p-0.5 sm:p-1 rounded-full ${currentSort === 'lowToHigh' ? 'bg-red-500' : 'bg-gray-200'} transition-colors`}>
                    <FaArrowUp className={`text-xs sm:text-sm ${currentSort === 'lowToHigh' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">Low to High</span>
                  {currentSort === 'lowToHigh' && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Newest Button - Compact */}
                <button
                  onClick={() => handleSort('newest')}
                  className={`
                    flex flex-col items-center gap-1 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-md
                    transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-md
                    hover:-translate-y-0.5 group relative overflow-hidden
                    ${currentSort === 'newest' ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 group-hover:from-red-500/5 rounded-md transition-all"></div>
                  <div className={`p-0.5 sm:p-1 rounded-full ${currentSort === 'newest' ? 'bg-red-500' : 'bg-gray-200'} transition-colors`}>
                    <FaClock className={`text-xs sm:text-sm ${currentSort === 'newest' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">Newest</span>
                  {currentSort === 'newest' && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  )}
                </button>

                {/* Category Button - New addition */}
                <button
                  onClick={() => handleSort('category')}
                  className={`
                    flex flex-col items-center gap-1 p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-md
                    transition-all duration-300 hover:bg-red-50 hover:border-red-400 hover:shadow-md
                    hover:-translate-y-0.5 group relative overflow-hidden
                    ${currentSort === 'category' ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 group-hover:from-red-500/5 rounded-md transition-all"></div>
                  <div className={`p-0.5 sm:p-1 rounded-full ${currentSort === 'category' ? 'bg-red-500' : 'bg-gray-200'} transition-colors`}>
                    <FaTags className={`text-xs sm:text-sm ${currentSort === 'category' ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center leading-tight">Category</span>
                  {currentSort === 'category' && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </div>

              {/* Close button with red accent - Compact */}
              <div className="flex justify-center mt-3 sm:mt-4">
                <button
                  onClick={() => setSort(false)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-all duration-300"
                >
                  <div className="w-0.5 h-3 bg-red-500 rounded"></div>
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-6 border bg-gray-50 text-gray-600 border-gray-200 rounded-lg">
            <p className="text-lg font-semibold">No products found. Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => {
              const rating = product.rating_summary ? parseFloat(product.rating_summary.average_rating) || 0 : 0;
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 >= 0.5;
              const totalReviews = product.rating_summary ? product.rating_summary.total_reviews || 0 : 0;
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
                        onClick={(e) => addTocart(product.id, e)}
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
                        onClick={(e) => handleBuyNow(product, e)}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProductList;