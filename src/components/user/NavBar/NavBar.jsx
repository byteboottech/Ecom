import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FaBars,
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaChevronUp,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import "./nav.css";
import SideBar from "../SIdeBar/SideBar";
import { useAuth } from "../../../Context/UserContext";
import { getCategoryForUser } from "../../../Services/Settings";
import { getAllProduct } from "../../../Services/Products";
// import NavBarMenu from "./NavBarMenu";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { addTocart } from '../../../Services/userApi';
// import metrix_logo from '../../../Images/maxtreobgremoved.png';
import maxtreoLogo from '../../../Images/maxtro_log_with_text.png'
import Login from "../../user/Login/Login"; 
import SearchBarNav from "./SearchBarNav";

const ModernNavbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const [scrolled, setScrolled] = useState(false);
  // const [lastScroll, setLastScroll] = useState(0);
  // const [navbarHidden, setNavbarHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownScroll, setDropdownScroll] = useState({
    top: true,
    bottom: false,
  });
  const [syncingCart, setSyncingCart] = useState(false);
  const [cartSyncStatus, setCartSyncStatus] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const [productsItems, setProductsItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const prevUserRef = useRef(user);
  const location = useLocation();

  const currentSearchQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);

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

  const clearGuestCart = () => {
    try {
      sessionStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Error clearing guest cart:', error);
    }
  };

  // Sync guest cart to user account
  const syncGuestCartToBackend = useCallback(async () => {
    const guestCartItems = getGuestCart();
    
    if (guestCartItems.length === 0) {
      return { success: true, message: 'No items to sync' };
    }

    setSyncingCart(true);
    let successCount = 0;
    let failureCount = 0;
    const totalItems = guestCartItems.reduce((total, item) => total + item.quantity, 0);

    try {
      for (const item of guestCartItems) {
        for (let i = 0; i < item.quantity; i++) {
          try {
            const result = await addTocart(item.productId);
            if (result) {
              successCount++;
            } else {
              failureCount++;
            }
          } catch (error) {
            console.error(`Failed to add item ${item.productId}:`, error);
            failureCount++;
          }
        }
      }

      if (successCount > 0) {
        clearGuestCart();
      }

      const syncResult = {
        success: failureCount === 0,
        successCount,
        failureCount,
        totalItems,
        message: failureCount === 0 
          ? `Successfully synced ${successCount} items to your cart!`
          : `Synced ${successCount}/${totalItems} items. ${failureCount} items failed to sync.`
      };

      setCartSyncStatus(syncResult);
      
      setTimeout(() => {
        setCartSyncStatus(null);
      }, 5000);

      return syncResult;

    } catch (error) {
      console.error('Error syncing guest cart:', error);
      setCartSyncStatus({
        success: false,
        message: 'Failed to sync cart items. Please try again.'
      });
      
      setTimeout(() => {
        setCartSyncStatus(null);
      }, 5000);
      
      return { success: false, message: 'Sync failed' };
    } finally {
      setSyncingCart(false);
    }
  }, []);

  // Monitor user login state and sync cart
  useEffect(() => {
    if (!prevUserRef.current && user) {
      console.log('User logged in, syncing guest cart...');
      syncGuestCartToBackend();
    }
    prevUserRef.current = user;
  }, [user, syncGuestCartToBackend]);

  // Sync searchQuery with URL params when on /search page
  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchQuery(currentSearchQuery);
      // The filtering useEffect will handle suggestions visibility
    } else {
      setSearchQuery('');
      setShowSuggestions(false);
    }
  }, [location.pathname, currentSearchQuery]);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setShowSuggestions(false);
  }, [location.pathname]);

  const getProductDropDownList = async () => {
    try {
      const originalCategories = await getCategoryForUser();
      console.log("original categories:", originalCategories);
      const allProductsRes = await getAllProduct();
      console.log("all products:", allProductsRes);
      const categoryData = Array.isArray(originalCategories) ? originalCategories : (originalCategories.data || []);
      const productsData = Array.isArray(allProductsRes) ? allProductsRes : (allProductsRes.data || []);
      setProductsItems(categoryData);
      setAllProducts(productsData);
      console.log("categories set:", categoryData);
      console.log("products set:", productsData);
    } catch (error) {
      console.log(error, "error while fetching categories or products");
      setProductsItems([]);
      setAllProducts([]);
    }
  };

  // Extract product names and categories into suggestions array
  useEffect(() => {
    console.log('Building suggestions - allProducts length:', allProducts.length, 'productsItems length:', productsItems.length);
    const productSuggestions = allProducts.map((p) => ({
      label: p.name,
      type: 'product',
      id: p.id,
      category: p.category
    }));
    const categorySuggestions = productsItems.map((c) => ({
      label: c.name,
      type: 'category',
      id: c.id
    }));
    const newSuggestions = [...productSuggestions, ...categorySuggestions];
    setSuggestions(newSuggestions);
    console.log('Suggestions built:', newSuggestions.length, newSuggestions.slice(0, 3)); // Log first few for debug
  }, [allProducts, productsItems]);

  // Filter suggestions based on search query
  useEffect(() => {
    console.log('Filtering suggestions for query:', searchQuery);
    if (searchQuery.trim().length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.label.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      // Sort filtered suggestions: first by products, then by alphabetical order
      const sortedFiltered = filtered.sort((a, b) => {
        if (a.type === 'product' && b.type === 'category') return -1;
        if (a.type === 'category' && b.type === 'product') return 1;
        return a.label.localeCompare(b.label);
      });
      const limited = sortedFiltered.slice(0, 8);
      setFilteredSuggestions(limited);
      setShowSuggestions(limited.length > 0);
      console.log('Filtered suggestions:', limited.length, limited);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      console.log('No query, hiding suggestions');
    }
  }, [searchQuery, suggestions]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScroll = window.pageYOffset;
  //     setScrolled(currentScroll > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
        setHoveredCategory(null);
      }
      // Handle click outside for search suggestions
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        console.log('Click outside, hiding suggestions');
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    getProductDropDownList();
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownScroll = (e) => {
    const element = e.target;
    const isAtTop = element.scrollTop === 0;
    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

    setDropdownScroll({
      top: isAtTop,
      bottom: isAtBottom,
    });
  };

  const scrollDropdown = (direction) => {
    if (dropdownRef.current) {
      const scrollAmount = 100;
      if (direction === "up") {
        dropdownRef.current.scrollTop -= scrollAmount;
      } else {
        dropdownRef.current.scrollTop += scrollAmount;
      }
    }
  };

  const socialMedia = [
    { icon: FaFacebookF, url: "https://facebook.com", color: "#1877F2" },
    { icon: FaTwitter, url: "https://twitter.com", color: "#1DA1F2" },
    { icon: FaInstagram, url: "https://instagram.com", color: "#E4405F" },
    { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" },
  ];

  const openLoginModal = () => {
    setShowLoginModal(true);
    document.body.style.overflow = "hidden"; // Prevent body scroll when modal is open
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    document.body.style.overflow = "auto"; // Restore body scroll
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  // const handleSuggestionClick = (suggestion) => {
  //   console.log('Suggestion clicked:', suggestion);
  //   setShowSuggestions(false);
  //   setSearchQuery("");
  //   if (suggestion.type === 'product') {
  //     navigate(`/product/${suggestion.id}`);
  //   } else if (suggestion.type === 'category') {
  //     navigate(`/categoryproductlist?categoryId=${suggestion.id}&categoryName=${encodeURIComponent(suggestion.label)}`);
  //   }
  // };

      const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.label); // put clicked value inside input
    setShowSuggestions(false);        // hide dropdown
    };


  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Show suggestions on focus if query exists
  const handleInputFocus = (e) => {
    e.target.parentElement.style.borderColor = '#ddd'; 
    e.target.parentElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; 
    if (searchQuery.trim() && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e) => {
    e.target.parentElement.style.borderColor = '#e0e0e0'; 
    e.target.parentElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; 
    // Delay hide to allow suggestion click
    setTimeout(() => {
      if (document.activeElement !== searchInputRef.current) {
        setShowSuggestions(false);
        console.log('Blur, hiding suggestions');
      }
    }, 200);
  };

  return (
    <>
      {/* Cart Sync Status Notification */}
      {cartSyncStatus && (
        <div className={`cart-sync-notification ${cartSyncStatus.success ? 'success' : 'error'}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {cartSyncStatus.success ? '✓' : '✕'}
            </span>
            <div className="notification-text">
              <p>{cartSyncStatus.message}</p>
              {cartSyncStatus.successCount > 0 && cartSyncStatus.failureCount > 0 && (
                <span className="notification-details">
                  Success: {cartSyncStatus.successCount}, Failed: {cartSyncStatus.failureCount}
                </span>
              )}
            </div>
            <button
              className="notification-close"
              onClick={() => setCartSyncStatus(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Cart Syncing Loader */}
      {syncingCart && (
        <div className="cart-sync-loader">
          <div className="loader-spinner"></div>
          <div className="loader-text">
            <p>Syncing your cart...</p>
            <span>Please wait while we add your items</span>
          </div>
        </div>
      )}

      {/* Login Modal Overlay */}
 {showLoginModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={closeLoginModal}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLoginModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <Login onClose={closeLoginModal} />
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
     

      {/* Main Navigation - Enhanced for attractiveness */}
      <nav 
        className="modern-navbar"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="nav-container" style={{ position: 'relative' }}>
          {/* Logo Section - Hamburger on left for all screens */}
          <div className="logo-section">
            {/* Hamburger - Now visible on all screens */}
            <button className="menu-btn" onClick={openSidebar}>
              <FaBars />
              {isMobile && <span className="menu-text">MENU</span>}
            </button>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.2s ease',
                overflow:'hidden'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <img src={maxtreoLogo} alt="Maxtreo Logo" className="logo" />
            </Link>
            {/* Desktop Categories Dropdown - Next to logo */}
            {!isMobile && (
              <div className="dropdown-container">
                <button
                  className="category-dropdown-trigger"
                  onClick={() => handleDropdownToggle("categories")}
                  onMouseEnter={() => setActiveDropdown("categories")}
                >
                  <FaBars className="categories-icon" />
                  All Categories
                  <FaChevronDown className="dropdown-icon" />
                </button>
                <div
                  className={`categories-dropdown ${
                    activeDropdown === "categories" ? "active" : ""
                  } ${hoveredCategory ? "expanded" : ""}`}
                  onMouseLeave={() => {
                    setActiveDropdown(null);
                    setHoveredCategory(null);
                  }}
                >
                  <div className="dropdown-wrapper">
                    {!dropdownScroll.top && (
                      <button
                        className="scroll-indicator scroll-up"
                        onClick={() => scrollDropdown("up")}
                      >
                        <FaChevronUp />
                      </button>
                    )}
                    <div
                      className="dropdown-content mega-dropdown"
                      ref={dropdownRef}
                      onScroll={handleDropdownScroll}
                      style={{ display: 'flex', flexDirection: 'row', height: '100%' }}
                    >
                      <div 
                        className={`left-column ${hoveredCategory ? 'has-hover' : ''}`}
                        style={{ 
                          minWidth: '200px',
                          borderRight: hoveredCategory ? '1px solid #eee' : 'none'
                        }}
                      >
                        {Array.isArray(productsItems) && productsItems.length > 0 ? (
                          productsItems.map((item, index) => (
                            <div
                              key={index}
                              className={`dropdown-item-wrapper ${hoveredCategory === item.id ? 'active' : ''}`}
                              onMouseEnter={() => setHoveredCategory(item.id)}
                              onMouseLeave={() => setHoveredCategory(null)}
                            >
                              <Link
                                to={`/categoryproductlist?categoryId=${item.id}&categoryName=${encodeURIComponent(item.name)}`}
                                className="dropdown-item"
                              >
                                {item.name}
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="loading-placeholder">Loading categories...</div>
                        )}
                      </div>
                      <div 
                        className={`right-column sub-dropdown separate-box ${hoveredCategory ? 'show' : ''}`}
                        style={{ 
                          display: hoveredCategory ? 'block' : 'none'
                        }}
                        onMouseEnter={() => {
                          // Keep the current hovered category active when mouse enters products section
                        }}
                      >
                        {(() => {
                          const selectedCat = productsItems.find((cat) => cat.id === hoveredCategory);
                          if (selectedCat) {
                            const catProducts = allProducts
                              .filter((p) => p.category === selectedCat.name)
                              .slice(0, 6);
                            if (catProducts.length > 0) {
                              return (
                                <div className="products-box">
                                  <h4 style={{ marginBottom: '15px', fontSize: '18px', color: '#333' }}>
                                    {selectedCat.name} Products
                                  </h4>
                                  <div className="product-grid" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                    gap: '12px' 
                                  }}>
                                    {catProducts.map((product, idx) => (
                                      <Link 
                                        key={idx} 
                                        to={`/product/${product.id}`} 
                                        className="product-item"
                                        style={{
                                          textDecoration: 'none',
                                          color: '#555',
                                          padding: '10px 12px',
                                          border: '1px solid #eee',
                                          borderRadius: '4px',
                                          transition: 'all 0.2s',
                                          fontSize: '14px',
                                          lineHeight: '1.4'
                                        }}
                                      >
                                        {product.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="no-products" style={{ padding: '20px', color: '#999' }}>
                                  No products available
                                </div>
                              );
                            }
                          } else {
                            return (
                              <div className="no-products" style={{ padding: '20px', color: '#999' }}>
                                Hover over a category to see products
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                    {!dropdownScroll.bottom && (
                      <button
                        className="scroll-indicator scroll-down"
                        onClick={() => scrollDropdown("down")}
                      >
                        <FaChevronDown />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar - Center (Desktop Only) */}
          {!isMobile && (
            <div className="search-section" style={{ 
              flex: 1, 
              maxWidth: '600px', 
              minWidth: '300px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }} ref={suggestionsRef}>
              <form onSubmit={handleSearch} className="search-form" style={{ 
                position: 'relative', 
                width: '100%',
                maxWidth: '500px'
              }}>
                <div 
                  className="search-input-container" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    border: '2px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '0 20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    width: '100%'
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => {
                      console.log('Search query changed:', e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="search-input"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '12px 0',
                      fontSize: '16px',
                      background: 'transparent'
                    }}
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#333'}
                      onMouseOut={(e) => e.target.style.color = '#666'}
                    >
                      <FaTimes style={{ fontSize: '18px' }} />
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="search-button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#333'}
                    onMouseOut={(e) => e.target.style.color = '#666'}
                  >
                    <FaSearch className="search-icon" style={{ fontSize: '18px' }} />
                  </button>
                </div>
              </form>

              {/* Auto-Suggestion Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                  className="suggestions-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '500px', // Match input width
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1002, // Higher than other dropdowns
                    borderRadius: '0 0 8px 8px',
                    marginTop: '2px'
                  }}
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.id}-${index}`}
                      onMouseDown={() => handleSuggestionClick(suggestion)} // Prevent blur
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <span style={{ fontWeight: '500', color: '#333' }}>{suggestion.label}</span>
                      <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
                        {suggestion.type}
                        {suggestion.type === 'product' && suggestion.category ? ` - ${suggestion.category}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Actions - Right (No hamburger here now) */}
          <div className="actions-section">
            <div className="action-items">
              {!isMobile && (
                <>
                  {user ? (
                    <div className="user-welcome">
                      {/* <span>Hi, {user.name || user.email}</span> */}    {/* commented for removing email from navbar */}
                    </div>
                  ) : (
                    <button onClick={openLoginModal} className="auth-link">
                      <FaUser className="action-icon" />
                      <span>Login</span>
                    </button>
                  )}
                  
                  <Link to="/cart" className="auth-link cart-link"> 
                    <FaShoppingCart className="action-icon" />
                    <span>Cart</span>
                  </Link>
                </>
              )}
              
              {/* Social Media Icons - Desktop only */}
              {!isMobile && (
                <div className="social-icons" style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={`Follow us on ${social.url.split('.')[1]}`}
                    >
                      <social.icon className="social-icon" style={{ color: social.color, fontSize: '1.2rem' }} />
                    </a>
                  ))}
                </div>
              )}
                
              {/* Mobile Cart Icon - Right side */}
              {isMobile && (
                <Link to="/cart" className="mobile-cart-icon">
                  <FaShoppingCart className="action-icon" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        {/* <div className="categories-nav">         COMMENT FOR REDUCTING THE NAVBAR HEIGHT
          <div className="categories-container">
            <div className="quick-links">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="quick-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div> */}
      </nav>

      {/* Mobile Search Bar - Render below navbar on mobile */}
      {/* {isMobile && <SearchBarNav />} */}

      <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} position="left" />
    </>
  );
};

export default ModernNavbar; 