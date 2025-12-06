// Updated Parent Component: ModernNavbar.jsx
// Navigation path changed to "/categoryproductlist" with query params for category.
// Removed client-side search functionality with dropdown results.
// Changes:
// - Moved hamburger menu button to left side (inside logo-section, only visible on mobile) for sidebar opening from left.
// - Categories dropdown icon remains on left next to logo on desktop.
// - Sidebar position set to "left" (assumes SideBar component handles left slide-in).
// - Ensured navbar attractiveness with previous enhancements.
// Fixes:
// 1. Hamburger icon now visible on all screens (desktop and mobile) for consistent sidebar access.
// 2. Sidebar prop position="left" retained; assumes SideBar component implements left-side slide-in (no changes needed here if SideBar uses the prop correctly).
// 3. Search bar now visible and responsive on mobile: stacked layout with horizontal scrollable categories above full-width search.
// Additional Fix: On mobile, conditionally render only the full-width search bar (hide left-categories entirely via JSX condition for better performance/responsiveness).

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { getCategory } from "../../../Services/Settings";
import { getAllProduct } from "../../../Services/Products";
// import NavBarMenu from "./NavBarMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addTocart } from '../../../Services/userApi';
// import metrix_logo from '../../../Images/maxtreobgremoved.png';
import maxtreoLogo from '../../../Images/maxtreo-refined-logo.png'
import Login from "../../user/Login/Login"; 

const ModernNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  // const [lastScroll, setLastScroll] = useState(0);
  // const [navbarHidden, setNavbarHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSearchCategory, setHoveredSearchCategory] = useState(null);
  const [dropdownScroll, setDropdownScroll] = useState({
    top: true,
    bottom: false,
  });
  const [syncingCart, setSyncingCart] = useState(false);
  const [cartSyncStatus, setCartSyncStatus] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const [productsItems, setProductsItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const prevUserRef = useRef(user);
  const location = useLocation();

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

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setHoveredCategory(null);
    setHoveredSearchCategory(null);
  }, [location.pathname]);

  // Clear search on blur or escape
  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const getProductDropDownList = async () => {
    try {
      const originalCategories = await getCategory();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setScrolled(currentScroll > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container") && !event.target.closest(".search-category-dropdown")) {
        setActiveDropdown(null);
        setHoveredCategory(null);
        setHoveredSearchCategory(null);
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

  const handleSearchCategoryHover = (catId) => {
    setHoveredSearchCategory(catId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery });
      if (selectedCategory !== "all") {
        params.append('category', selectedCategory);
      }
      navigate(`/search?${params.toString()}`);
      setSearchQuery(""); // Clear input
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const firstFourCategories = productsItems.slice(0, 4);

 

  const quickLinks = [
    { name: "Products", path: "/products" },
      // { name: "Deals & Offers", path: "/deals" },
    { name: "Track Order", path: "/myorder" },
    { name: "Support", path: "/support" }
  ];

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

  const renderCategoryDropdown = (category) => {
    const catProducts = allProducts.filter((p) => p.category === category.name).slice(0, 6);
    return (
      <div className={`search-category-dropdown ${hoveredSearchCategory === category.id ? 'active' : ''}`} key={category.id} style={{ position: 'relative' }}>
        <Link
          to={`/categoryproductlist?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
          className="search-category-trigger"
          onMouseEnter={() => handleSearchCategoryHover(category.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '500',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {category.name}
          <FaChevronDown className="dropdown-icon-small" style={{ fontSize: '10px' }} />
        </Link>
        {hoveredSearchCategory === category.id && (
          <div 
            className="search-category-menu" 
            style={{ 
              position: 'absolute', 
              top: '100%', 
              left: '-50%', // Adjust to center or full width as needed
              zIndex: 1000, 
              background: 'white', 
              border: '1px solid #e0e0e0', 
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)', 
              minWidth: '400px',
              padding: '20px',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'hidden'
            }}
          >
            <div className="category-products-section" style={{ display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ 
                margin: '0 0 15px 0', 
                fontSize: '18px', 
                color: '#333', 
                fontWeight: '600',
                paddingBottom: '10px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                {category.name} Products
              </h4>
              {catProducts.length > 0 ? (
                <div className="product-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '12px',
                  width: '100%'
                }}>
                  {catProducts.map((product, idx) => (
                    <Link 
                      key={idx} 
                      to={`/product/${product.id}`} 
                      className="product-item"
                      style={{
                        textDecoration: 'none',
                        color: '#555',
                        padding: '10px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                        fontSize: '13px',
                        lineHeight: '1.4',
                        textAlign: 'center',
                        backgroundColor: 'white'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.borderColor = '#ddd';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#f0f0f0';
                        e.target.style.transform = 'none';
                      }}
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No products available</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
        className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
        style={{
          background: scrolled 
            ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' 
            : 'transparent',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
            : 'none',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
        }}
      >
        <div className="nav-container">
          {/* Logo Section - Hamburger on left for all screens */}
          <div className="logo-section">
            {/* Hamburger - Now visible on all screens */}
            <button className="menu-btn" onClick={openSidebar}>
              <FaBars />
            </button>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.2s ease'
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

          {/* Quick Links - Center */}
          {!isMobile && (
            <div>
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

      {/* Search Bar Under Navbar - Less Rounded */}
      <div className="search-bar-section attractive-search">
        <div className="search-wrapper" style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '15px 20px', 
          maxWidth: '1400px', // Full width increase
          margin: '0 auto',
          gap: '20px', // Increased space between elements
          width: '100%'
        }}>
          {/* Left Categories - All Four Horizontal - Only on Desktop */}
          {!isMobile && (
            <div className="left-categories" style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '20px', // Space between each category
              alignItems: 'center',
              flexShrink: 0
            }}>
              {firstFourCategories.map((category) => renderCategoryDropdown(category))}
            </div>
          )}

          {/* Center Search - Modern Design, Less Rounded */}
          <div className="search-container" style={{ 
            flex: 1, 
            maxWidth: '600px', 
            minWidth: '300px',
            flexShrink: 0,
            position: 'relative'
          }}>
            <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative' }}>
              <div 
                className="search-input-container" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px', // Reduced from 50px for less rounded appearance
                  padding: '0 20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={(e) => { 
                    e.target.parentElement.style.borderColor = '#ddd'; 
                    e.target.parentElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; 
                  }}
                  onBlur={(e) => { 
                    e.target.parentElement.style.borderColor = '#e0e0e0'; 
                    e.target.parentElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; 
                  }}
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
          </div>

          {/* No Right Categories */}
        </div>
      </div>

      <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} position="left" />
    </>
  );
};

export default ModernNavbar;