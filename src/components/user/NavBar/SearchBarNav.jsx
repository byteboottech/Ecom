import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "../../../Services/Settings";
import { getAllProduct } from "../../../Services/Products";

const SearchBarNav = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredSearchCategory, setHoveredSearchCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productsItems, setProductsItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch categories and products
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
    getProductDropDownList();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setShowSuggestions(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

//   const handleSuggestionClick = (suggestion) => {
//     console.log('Suggestion clicked:', suggestion);
//     setShowSuggestions(false);
//     setSearchQuery("");
//     if (suggestion.type === 'product') {
//       navigate(`/product/${suggestion.id}`);
//     } else if (suggestion.type === 'category') {
//       navigate(`/categoryproductlist?categoryId=${suggestion.id}&categoryName=${encodeURIComponent(suggestion.label)}`);
//     }
//   };

    const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.label); // put clicked value inside input
    setShowSuggestions(false);        // hide dropdown
    };


  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Show all suggestions on focus if no query (optional enhancement)
  const handleInputFocus = (e) => {
    e.target.parentElement.style.borderColor = '#ddd'; 
    e.target.parentElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; 
    // Only show if there is a query
    if (searchQuery.trim() && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const firstFourCategories = productsItems.slice(0, 4);

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
        }} ref={suggestionsRef}>
          <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative' }}>
            <div 
              className="search-input-container" 
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '0px', // Reduced from 50px for less rounded appearance
                padding: '0 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
                overflow: 'hidden'
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
                onBlur={(e) => { 
                  e.target.parentElement.style.borderColor = '#e0e0e0'; 
                  e.target.parentElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; 
                  // Delay hide to allow suggestion click
                  setTimeout(() => {
                    if (document.activeElement !== searchInputRef.current) {
                      setShowSuggestions(false);
                      console.log('Blur, hiding suggestions');
                    }
                  }, 200);
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
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderTop: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1001, // Increased z-index to ensure visibility
                borderRadius: '0 0 8px 8px' // Slight rounding on bottom
              }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.id}-${index}`} // Better key
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

        {/* No Right Categories */}
      </div>
    </div>
  );
};

export default SearchBarNav;