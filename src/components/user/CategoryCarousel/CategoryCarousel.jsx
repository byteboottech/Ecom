import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from "../../../Axios/Axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import MobileBottomNavbar from '../NavBar/MobileBottomNavbar';
import { FaBolt, FaSpinner, FaStar, FaShoppingCart } from "react-icons/fa";
import { useAuth } from '../../../Context/UserContext';
import { addTocart as addToCartService } from '../../../Services/userApi';
import Alert from '../Alert/Alert';

function CategoryCarousel() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [guestCart, setGuestCart] = useState([]);

  const alertTimeoutRef = useRef(null);
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
    if (!slug) {
      setError('No category slug provided');
      setLoading(false);
      console.log('No slug provided, setting error');
      return;
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching category data for slug: ${slug}`);

        const response = await Axios.get(`/advertisement/product/categories/${slug}/`);
        console.log("Category API Response:", response);
        console.log("Category API Response Data:", response.data);
        
        const sortedProducts = (response.data.category_products || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        console.log("Sorted Products:", sortedProducts);
        
        const updatedCategoryData = {
          ...response.data,
          category_products: sortedProducts
        };
        console.log("Updated Category Data:", updatedCategoryData);
        
        setCategoryData(updatedCategoryData);
      } catch (err) {
        console.error(`Error fetching category ${slug}:`, err);
        console.error("Error details:", err.response || err.message);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchCategoryData();
  }, [slug]);

  useEffect(() => {
    if (categoryData) {
      console.log("Category Data Updated in State:", categoryData);
      console.log("Total Products:", categoryData.total_products);
      console.log("Category Products Length:", categoryData.category_products?.length);
    }
  }, [categoryData]);

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
        const product = categoryData.category_products.find(cp => cp.product.id === id)?.product;
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
    event.stopPropagation();

    if (!user) {
      addToGuestCart(product.id, product);

      showAlert({
        type: "info",
        message: "Please login to continue with Buy Now"
      });

      navigate("/login");
    } else {
      navigate(`/Details/${product.id}`, {
        state: {
          buyNow: true,
          quantity: 1
        }
      });
    }
  };

  const navigateToDetails = (id) => {
    navigate(`/Details/${id}`);
  };

  console.log("Component Render - Slug:", slug);
  console.log("Component Render - Loading:", loading);
  console.log("Component Render - Error:", error);
  console.log("Component Render - CategoryData:", categoryData);

  if (loading) {
    console.log("Rendering Loading State");
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    console.log("Rendering Error State", { error, categoryData });
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-red-600">
            <div className="text-lg font-semibold mb-2">Error loading category</div>
            <div className="text-sm">{error || 'Category not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering Main Content with Category Data:", categoryData);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {alertData && (
        <Alert 
          type={alertData.type}
          message={alertData.message}
          productId={alertData.productId}
          error={alertData.error}
          onClose={() => setAlertData(null)}
        />
      )}
      
      {/* Category Header with Description */}
      <div className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {categoryData.name || slug.toUpperCase()}
          </h1>
          {categoryData.description && (
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-2xl">
              {categoryData.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="py-10 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          {categoryData.total_products > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {categoryData.category_products.map((catProd, index) => {
                const product = catProd.product;
                const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                const discountPercent = product.discount_price ? Math.round((parseFloat(product.mrp) - parseFloat(product.price)) / parseFloat(product.mrp) * 100) : 0;
                const rating = product.rating_summary ? parseFloat(product.rating_summary.average_rating) || 0 : 0;
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                const totalReviews = product.rating_summary ? product.rating_summary.total_reviews || 0 : 0;

                console.log(`Rendering Product ${index + 1}:`, { productId: product.id, productName: product.name, primaryImage, discountPercent });

                return (
                  <div 
                    key={product.id}
                    onClick={() => navigateToDetails(product.id)}
                    className="group flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative h-full"
                  >
                    {/* Yellow accent details */}
                    <div className="absolute top-0 left-0 w-0.5 lg:w-1 h-12 lg:h-16 bg-yellow-400"></div>
                    <div className="absolute top-0 right-0 w-8 lg:w-12 h-0.5 bg-yellow-400"></div>
                    <div className="absolute bottom-0 left-0 w-10 lg:w-16 h-0.5 bg-yellow-400"></div>

                    {/* Product Image */}
                    <div className="relative h-44 lg:h-56 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={primaryImage?.image_url || primaryImage?.image || ''}
                        alt={product.name}
                        className="h-32 lg:h-44 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Yellow accent in image area */}
                      <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 w-1.5 lg:w-2 h-8 lg:h-10 bg-yellow-400"></div>
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Content */}
                    <div className="flex-1 flex flex-col justify-between p-3 lg:p-5">
                      <div>
                        {/* Brand */}
                        {product.brand_name && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium text-center">
                            {product.brand_name}
                          </p>
                        )}

                        {/* Product Name */}
                        <h3 className="font-bold text-base lg:text-xl mb-3 lg:mb-4 line-clamp-2 leading-tight text-gray-900 text-center">
                          {product.name}
                        </h3>

                        {/* Dynamic Rating - Centered */}
                        <div className="flex items-center justify-center gap-1 lg:gap-1.5 mb-3 lg:mb-4">
                          {[1,2,3,4,5].map((star) => {
                            if (star <= fullStars) {
                              return (
                                <FaStar 
                                  key={star}
                                  className="text-sm lg:text-base text-yellow-400 fill-current"
                                />
                              );
                            } else if (star === fullStars + 1 && hasHalfStar) {
                              return (
                                <FaStar 
                                  key={star}
                                  className="text-sm lg:text-base text-yellow-400 fill-current"
                                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                                />
                              );
                            } else {
                              return (
                                <FaStar 
                                  key={star}
                                  className="text-sm lg:text-base text-gray-300"
                                />
                              );
                            }
                          })}
                          <span className="text-sm lg:text-base ml-1 text-gray-600">
                            ({rating.toFixed(1)}){totalReviews > 0 && ` (${totalReviews})`}
                          </span>
                        </div>

                        {/* Pricing - Always show crossed MRP, use real mrp if available and > price, else price * 1.2 */}
                        <div className="flex items-center justify-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
                          <span className="text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">
                            ₹{parseFloat(product.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs lg:text-sm line-through text-gray-400 whitespace-nowrap">
                            ₹{product.mrp && parseFloat(product.mrp) > parseFloat(product.price) 
                              ? parseFloat(product.mrp).toLocaleString('en-IN') 
                              : (parseFloat(product.price) * 1.2).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons - Add to Cart + Buy Now */}
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => addTocart(product.id, e)}
                          disabled={addingToCart === product.id}
                          className={`flex-1 py-1.5 lg:py-2 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm font-bold transition-all duration-300 ${
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
                          className="flex-1 py-1.5 lg:py-2 text-xs lg:text-sm font-bold text-white flex items-center justify-center gap-1 lg:gap-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300"
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
          ) : (
            console.log("No products available, rendering empty state"),
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <FaShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-500">
                Check back soon for new products in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNavbar />
    </div>
  );
}

export default CategoryCarousel;