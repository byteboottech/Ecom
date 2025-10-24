import React, { useEffect, useState, useRef } from 'react';
import { 
  FaSearch, 
  FaSpinner, 
  FaFilter, 
  FaSort,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { getAllProduct } from '../../../Services/Products';
import baseUrl from '../../../Static/Static';
import { useAuth } from '../../../Context/UserContext';
import { addTocart as addToCartService } from '../../../Services/userApi';
import Filter from '../Filter/Filter';
import Sorting from '../Sorting/Sorting';
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
  const [darkMode, setDarkMode] = useState(false);
  const [guestCart, setGuestCart] = useState([]);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const alertTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { user } = useAuth();

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
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }

    return () => {
      document.body.classList.remove('dark');
      document.body.classList.remove('light');
    };
  }, [darkMode]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let productData = await getAllProduct();
        
        // Filter API response based on category prop (using string name to match API structure)
        if (category && category.name) {
          console.log(`Filtering products for category name: "${category.name}"`);
          productData = productData.filter(product => product.category === category.name);
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

  // Check if scroll buttons should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const addTocart = async (id, event) => {
    event.stopPropagation();
    
    try {
      setAddingToCart(id);
      
      if (!user) {
        const product = products.find(p => p.id === id);
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
  };

  const handleBuyNow = (product, event) => {
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
  };

  const navigateToDetails = (id) => {
    window.location.href = `/Details/${id}`; // Fallback without navigate
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const viewGuestCart = () => {
    if (guestCart.length === 0) {
      showAlert({
        type: "info",
        message: "Your cart is empty"
      });
      return;
    }

    console.log('Guest cart:', guestCart);
    showAlert({
      type: "info",
      message: `You have ${getGuestCartCount()} items in your cart. Login to sync.`
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic header based on category prop
  const pageTitle = category ? `Products in ${category.name}` : "Featured Products";
  const pageSubtitle = category ? `Explore our ${category.name.toLowerCase()} collection` : "Discover our exclusive collection";

  return (
    <div className={`min-h-screen px-4 py-8 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
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
        {/* Header Section - Dynamic based on category */}
        <div className={`mb-8 p-6 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl font-bold font-[Rajdhani] tracking-tight text-primary-blue dark:text-white relative inline-block">
                {pageTitle}
              </h1>
              <p className={`mt-3 text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {pageSubtitle}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3 text-base rounded-xl border-2 focus:border-[#07bff] ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} outline-none transition-all duration-300`}
                />
                <FaSearch className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button 
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${filter 
                    ? 'bg-[#07bff] text-white shadow-lg' 
                    : darkMode 
                      ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-[#07bff]' 
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-[#07bff]'
                  }`}
                  onClick={() => {
                    setFilter(!filter);
                    if (sort) setSort(false);
                  }}
                >
                  <FaFilter className={filter ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'} />
                  <span>FILTER</span>
                </button>

                <button 
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${sort 
                    ? 'bg-[#07bff] text-white shadow-lg' 
                    : darkMode 
                      ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-[#07bff]' 
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-[#07bff]'
                  }`}
                  onClick={() => {
                    setSort(!sort);
                    if (filter) setFilter(false);
                  }}
                >
                  <FaSort className={sort ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'} />
                  <span>SORT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {filter && (
          <div className={`mb-6 p-6 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <Filter products={products} setProducts={setProducts} />
          </div>
        )}

        {/* Sort Section */}
        {sort && (
          <div className={`mb-6 p-6 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <Sorting products={products} setProducts={setProducts} />
          </div>
        )}

        {/* Products Horizontal Scroller */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={`text-center py-16 px-6 rounded-xl border ${darkMode ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            <p className="text-lg font-semibold">No products found. Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll Buttons */}
            {showScrollButtons && (
              <>
                <button 
                  onClick={scrollLeft}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-900 text-white border-2 border-gray-700 hover:bg-[#07bff]' 
                      : 'bg-white text-black border-2 border-gray-300 hover:bg-[#07bff]'
                  } shadow-lg`}
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <button 
                  onClick={scrollRight}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-900 text-white border-2 border-gray-700 hover:bg-[#07bff]' 
                      : 'bg-white text-black border-2 border-gray-300 hover:bg-[#07bff]'
                  } shadow-lg`}
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </>
            )}

            {/* Products Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 px-2 -mx-2 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => navigateToDetails(product.id)}
                  className={`flex-shrink-0 w-72 group rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border ${darkMode 
                    ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-[#07bff]' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:border-[#07bff]'
                  }`}
                >
                  {/* Product Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#07bff] text-white shadow-lg bg-blue-500">
                      FEATURED
                    </span>
                  </div>

                  {/* Image Container */}
                  <div className="relative h-56 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={product.images?.[0]?.image 
                        ? baseUrl + product.images[0].image 
                        : "https://pnghq.com/wp-content/uploads/pnghq.com-gaming-computer-picture-p-4.png"
                      } 
                      alt={product.name}
                      className="h-44 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Quick Action Overlay - Always visible but subtle, with text on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className={`opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center gap-2 text-white`}>
                        <button className="w-12 h-12 rounded-full bg-[#07bff] flex items-center justify-center shadow-lg hover:bg-white hover:text-[#07bff] transition-all duration-300">
                          <FaBolt className="text-sm" />
                        </button>
                        <span className="text-xs font-semibold">Quick View</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="font-[Rajdhani] text-xl font-bold mb-3 line-clamp-2 leading-tight text-black dark:text-white">
                        {product.name}
                      </h2>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map((star) => (
                          <FaStar 
                            key={star}
                            className={`text-sm ${
                              star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-500'
                            }`}
                          />
                        ))}
                        <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          (4.0)
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold font-[Rajdhani] text-black dark:text-white">
                          ₹ {product.price?.toLocaleString()}
                        </span>
                        <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          ₹ {(product.price * 1.2)?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Always visible */}
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => addTocart(product.id, e)}
                        disabled={addingToCart === product.id}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-[Rajdhani] font-semibold transition-all duration-300 ${
                          addingToCart === product.id
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed'
                            : darkMode
                              ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <FaSpinner className="animate-spin text-sm" /> 
                            <span>ADDING...</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="text-sm" /> 
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 py-3 rounded-xl text-sm font-[Rajdhani] font-bold text-white flex items-center justify-center gap-2 bg-blue-500 shadow-lg"
                      >
                        <FaBolt className="text-sm" />
                        <span>BUY NOW</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-6">
              <div className={`flex gap-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-full p-1.5`}>
                <div className="w-2 h-2 rounded-full bg-[#07bff]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
              </div>
            </div>
          </div>
        )}

        {/* Custom scrollbar hide */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}

export default CategoryProductList;