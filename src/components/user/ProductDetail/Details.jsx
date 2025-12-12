import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../Context/UserContext";
import { addTocart } from "../../../Services/userApi";
import SingleProductOverview from "../CardPage/SingleProductOverView";
import BaseURL from "../../../Static/Static";
import NavBar from "../NavBar/NavBar";
import Alert from "../Alert/Alert";
import Loader from "../../../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import VideoThumbnail from './VideoThumbnail';
import Axios from '../../../Axios/Axios'
import { FaYoutube, FaCartPlus, FaBolt, FaCheck, FaWhatsapp, FaHeart } from 'react-icons/fa';

function Details({ product }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  // State for selected options and UI
  const selectedStorage = ".5";
  const selectedRam = "8";
  const [price, setPrice] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  console.log(showOptions)
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [cartData, setCartData] = useState(false);
  const [overView, setOverView] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productVideos, setProductVideos] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [guestCart, setGuestCart] = useState([]);
  const alertTimeoutRef = useRef(null);
 
  // Desktop hover zoom state
  const [showZoomPopup, setShowZoomPopup] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
 
  // Mobile image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  // Refs
  const imageContainerRef = useRef(null);
  const detailsRef = useRef(null);
  const videoPopupRef = useRef(null);
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
  // const saveGuestCart = (cartItems) => {
  // try {
  // sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
  // setGuestCart(cartItems);
  // } catch (error) { 172:6g
  // console.error('Error saving guest cart:', error);
  // }
  // };
  // const addToGuestCart = (productId, product) => {
  // const currentCart = getGuestCart();
  // const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
   
  // if (existingItemIndex > -1) {
  // // If item already exists, increase quantity
  // currentCart[existingItemIndex].quantity += 1;
  // } else {
  // // Add new item to cart
  // currentCart.push({
  // productId: productId,
  // productName: product.name,
  // productPrice: product.price,
  // productImage: product.images?.[0]?.image || null,
  // quantity: 1,
  // addedAt: new Date().toISOString()
  // });
  // }
   
  // saveGuestCart(currentCart);
  // return currentCart;
  // };
  const getGuestCartCount = () => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  };
  // Initialize guest cart on component mount
  useEffect(() => {
    const initialCart = getGuestCart();
    setGuestCart(initialCart);
  }, []);
  // Alert functionality
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
  // Fetch product videos
  useEffect(() => {
    if (product?.id) {
      const fetchVideos = async () => {
        try {
          const response = await Axios.get(`/inventory/products/${product.id}/videos/`);
          if (response.data && Array.isArray(response.data)) {
            setProductVideos(response.data);
          }
        } catch (error) {
          console.error("Error fetching product videos:", error);
        }
      };
     
      fetchVideos();
    }
  }, [product]);
  // Set initial main image and all images when product loads
  useEffect(() => {
    if (product) {
      // Inline getProductImage logic
      let initialImage = null;
      if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        const primaryImageObj = product.images.find(
          (img) => typeof img === "object" && img.is_primary && img.image
        );
        if (primaryImageObj) {
          initialImage = primaryImageObj.image;
        } else if (typeof product.images[0] === "object" && product.images[0].image) {
          initialImage = product.images[0].image;
        } else if (typeof product.images[0] === "string") {
          initialImage = product.images[0];
        }
      } else if (product?.image) {
        initialImage = product.image;
      }
      setMainImage(initialImage);
     
      // Create array of all images
      const images = [];
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => {
          if (typeof img === "object" && img.image) {
            images.push(img.image);
          } else if (typeof img === "string") {
            images.push(img);
          }
        });
      } else if (product.image) {
        images.push(product.image);
      }
     
      setAllImages(images);
     
      // Set current index based on main image
      if (initialImage) {
        const index = images.findIndex(img => img === initialImage);
        setCurrentImageIndex(index >= 0 ? index : 0);
      }
    }
  }, [product]);
  // Calculate price based on selections
  useEffect(() => {
     window.scrollTo(0, 0);
    if (product) {
      let basePrice = product.price || 0;
      if (selectedStorage === "1") basePrice += 1000;
      else if (selectedStorage === "2") basePrice += 3000;
      else if (selectedStorage === "3") basePrice += 6000;
      if (selectedRam === "16") basePrice += 1500;
      else if (selectedRam === "32") basePrice += 3500;
      else if (selectedRam === "64") basePrice += 8000;
      setPrice(basePrice);
    }
  }, [product]);
  // Animation and initial setup
  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        setShowOptions(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [product]);
  // Click outside video popup to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (videoPopupRef.current && !videoPopupRef.current.contains(event.target)) {
        setShowVideoPopup(false);
      }
    };
    if (showVideoPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVideoPopup]);
  // Handle mouse move for hover zoom - Desktop only
  const handleImageHoverMove = (e) => {
    if (!imageContainerRef.current || !showZoomPopup) return;
   
    const container = imageContainerRef.current;
    const containerRect = container.getBoundingClientRect();
   
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
   
    const xPercent = (x / containerRect.width) * 100;
    const yPercent = (y / containerRect.height) * 100;
   
    setZoomPosition({
      x: Math.max(0, Math.min(xPercent, 100)),
      y: Math.max(0, Math.min(yPercent, 100))
    });
  };
  const handleImageHoverEnter = () => {
    // Only enable hover zoom on desktop
    if (window.innerWidth >= 768 && mainImage) {
      setZoomImage(BaseURL + mainImage);
      setShowZoomPopup(true);
    }
  };
  const handleImageHoverLeave = () => {
    setShowZoomPopup(false);
  };
  // Mobile image click handler
  const handleImageClick = () => {
    // Only show modal on mobile devices
    if (window.innerWidth < 768) {
      setShowImageModal(true);
    }
  };
  // Modal navigation functions
  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);
  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);
  const closeImageModal = useCallback(() => {
    console.log('Closing image modal'); // Debug log
    setShowImageModal(false);
  }, []);
  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal) return;
     
      if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        closeImageModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, goToPrevImage, goToNextImage, closeImageModal]);
  // const handleStorageSelect = (storage) => {
  // setSelectedStorage(storage);
  // };
  // const handleRamSelect = (ram) => {
  // setSelectedRam(ram);
  // };
  const handleAddToCart = async (id, event) => {
    if (event) event.stopPropagation();
   
    try {
      setAddingToCart(id);
     
      if (!user) {
        // Handle guest user - save to session storage
        const productToAdd = product || product.find(p => p.id === id);
        if (productToAdd) {
          // const updatedCart = addToGuestCart(id, productToAdd);
          const cartCount = getGuestCartCount();
         
          showAlert({
            type: "success",
            message: `Item added to cart! You have ${cartCount} item(s) in cart. Login to sync your cart.`,
            productId: id
          });
        }
      } else {
        // Handle logged-in user - save to backend
        let cartResponse = await addTocart(id);
        setCartData(cartResponse);
        console.log(cartData)
        showAlert({
          type: "success",
          message: "Item successfully added to cart",
          productId: id
        });
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
  const handleAddToWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = wishlist.some(item => item.id === product.id);
      if (!exists) {
        wishlist.push({
          id: product.id,
          name: product.name,
          price: price,
          image: product.images?.[0]?.image || product.image,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showAlert({ type: "success", message: "Added to wishlist!" });
      } else {
        showAlert({ type: "info", message: "Already in wishlist!" });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showAlert({ type: "error", message: "Failed to add to wishlist" });
    }
  };
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant.variant_product_id);
    navigate(`/Details/${variant.variant_product_id}`)
  };
  const handleThumbnailClick = (image) => {
    setMainImage(image);
    setZoomImage(BaseURL + image);
   
    // Update current index for modal
    const index = allImages.findIndex(img => img === image);
    if (index >= 0) {
      setCurrentImageIndex(index);
    }
  };
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const handlePlayVideo = () => {
    setShowVideoPopup(true);
  };
  // const handleDownloadBrochure = () => {
  // if (product?.broacher) {
  // window.open(BaseURL + product.broacher, "_blank");
  // }
  // };
  const handleWatchYoutube = () => {
    if (product?.youtube_url) {
      window.open(product.youtube_url, "_blank");
    }
  };
  const videoId = getYoutubeVideoId(product?.youtube_url);
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  const handleBuyNow = async () => {
    try {
      setOverView(true);
    } catch (error) {
      console.error("Error in buy now:", error);
    }
  };
  const handleEnquiry = () => {
    const message = `Hi, I'm interested in the product: ${product.name}. Price: ₹${formatPrice(price)}. Please provide more details.`;
    const adminNumber = '91XXXXXXXXXX'; // Replace with actual admin WhatsApp number (include country code)
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  if (!product) {
    return <Loader />;
  }
  return (
    <>
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
{overView && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 
                  flex items-center justify-center p-4 
                  pt-4 md:pt-32">
    <div className="relative max-w-4xl w-full max-h-[70vh] 
                    bg-white rounded-xl overflow-y-auto scroll-smooth">
      <button
        className="absolute top-4 right-4 z-50 w-8 h-8 bg-gray-200 rounded-full 
                   flex items-center justify-center text-gray-800 hover:bg-gray-300"
        onClick={() => setOverView(false)}
      >
        <X className="w-5 h-5" />
      </button>

      <SingleProductOverview
        product={product}
        onClose={() => setOverView(false)}
      />
    </div>
  </div>
)}

      {/* Desktop Zoom Popup */}
      {showZoomPopup && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-y-1/2 ml-8 w-96 h-96 bg-white border-2 border-gray-300 shadow-xl overflow-hidden rounded-lg">
            <div
              className="w-full h-full bg-no-repeat bg-white"
              style={{
                backgroundImage: `url(${zoomImage})`,
                backgroundSize: '200% 200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
          </div>
        </div>
      )}
      {/* Mobile Image Modal - UPDATED CLOSE BUTTON */}

{showImageModal && (
  <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 md:hidden">
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Super Visible Close button - Adjusted position and styling */}
    <button
  className="absolute top-16 right-2 z-[60] 
             bg-transparent
             flex items-center justify-center 
             text-white drop-shadow-lg
             transition-all duration-200 active:scale-95"
  onClick={closeImageModal}
  aria-label="Close image modal"
>
  <X size={32} />
</button>


      {/* Navigation buttons - Also enhanced for consistency */}
      {allImages.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center text-black hover:shadow-lg shadow-md transition-all backdrop-blur-sm"
            onClick={goToPrevImage}
          >
            <ChevronLeft size={24} />
          </button>
         
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center text-black hover:shadow-lg shadow-md transition-all backdrop-blur-sm"
            onClick={goToNextImage}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      {/* Main image */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={BaseURL + allImages[currentImageIndex]}
          alt={`${product.name} view ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      {/* Image counter - Enhanced visibility */}
      {allImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      )}
      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                index === currentImageIndex ? 'border-white/80 bg-white/20' : 'border-white/30 hover:border-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={BaseURL + image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)}

      {/* Video Popup */}
      {showVideoPopup && videoId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade">
          <div className="relative w-11/12 max-w-4xl" ref={videoPopupRef}>
            <button
              className="absolute -top-10 -right-10 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-gray-800 text-2xl cursor-pointer hover:bg-gray-200 hover:scale-110 transition-all duration-300"
              onClick={() => setShowVideoPopup(false)}
            >
              ×
            </button>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                title="Product video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <div className="pt-20 min-h-screen bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-start gap-6 opacity-0 translate-y-8 animate-fade-up">
          {/* Left side - Product image and actions */}
          <div className="w-full md:w-2/5 md:sticky md:top-20 self-start">
            {/* Image container - Updated with mobile click support */}
            <div
              ref={imageContainerRef}
              className="w-full rounded-lg overflow-hidden bg-white p-3 transition-transform duration-300 hover:-translate-y-1 cursor-pointer relative border border-gray-300"
              onMouseEnter={handleImageHoverEnter}
              onMouseLeave={handleImageHoverLeave}
              onMouseMove={handleImageHoverMove}
              onClick={handleImageClick}
            >
              {mainImage ? (
                <div className="relative h-64 flex items-center justify-center overflow-hidden">
                  <img
                    src={BaseURL + mainImage}
                    alt={product.name || "Product"}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-auto object-contain max-h-64 rounded-lg transform transition-all duration-500 ${
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  />
                  {showZoomPopup && (
                    <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
                  )}
                  {/* Mobile tap indicator */}
                  <div className="md:hidden absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none">
                    Tap to view
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  No product image available
                </div>
              )}
            </div>
            {/* Action buttons */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start items-center">
              {/* Thumbnails */}
              {product.images && product.images.map((obj, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 overflow-hidden rounded border shadow-sm cursor-pointer transition-all ${
                    BaseURL + mainImage === BaseURL + obj.image ? 'border-2 border-blue-500' : 'border-gray-300'
                  } hover:border-blue-400`}
                  onClick={() => handleThumbnailClick(obj.image)}
                >
                  <img
                    src={BaseURL + obj.image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Video thumbnails */}
              {productVideos.length > 0 && <VideoThumbnail videos={productVideos} handlePlayVideo={handlePlayVideo}/>}
            </div>
          </div>
          {/* Right side - Product details */}
          <div
            ref={detailsRef}
            className="w-full md:w-3/5 flex flex-col rounded-lg p-4 relative bg-white border border-gray-300"
            style={{zIndex:"0"}}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            <div className="mb-4">
              <h3 className="relative uppercase tracking-wider text-xs pl-3 mb-3 font-medium text-gray-600 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-3 before:bg-blue-600">
                {product.category || "GAMING PC"} <span className="text-blue-600">||</span> {product.brand}
              </h3>
              <h1
                className="text-xl md:text-2xl font-bold mb-1 uppercase tracking-tight text-black"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                {product.name || "THE SPECTRE SERIES"}
              </h1>
             
              <div className="mb-3">
                {product.mrp && (
                  <del
                    className="text-sm mr-3 font-normal text-gray-500"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}
                  >
                    ₹ {formatPrice(product.mrp)}
                  </del>
                )}
                <span
                  className="text-xl font-bold text-blue-600"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  ₹ {formatPrice(price)}/-
                </span>
              </div>
            </div>
            <div
              className="text-sm leading-relaxed mb-4 pb-4 text-gray-700 border-b border-gray-300"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {product.description ||
                "Experience the ultimate gaming performance with our custom-built gaming PC, featuring the latest technology and components designed to deliver exceptional speed, graphics, and reliability for all your gaming needs."}
             
              <div className="flex gap-4 mt-3">
                {/* {product?.broacher && (
                  <button
                    className="flex items-center gap-1 text-[var(--color-primary)] hover:underline focus:outline-none"
                    onClick={handleDownloadBrochure}
                  >
                    <FaDownload size={12} /> <span>Download Brochure</span>
                  </button>
                )} */}
                {videoId && (
                  <button
                    className="flex items-center gap-1 text-blue-600 hover:underline focus:outline-none"
                    onClick={handleWatchYoutube}
                  >
                    <FaYoutube size={14} /> <span>Watch on YouTube</span>
                  </button>
                )}
              </div>
            </div>
            {/* Variants Section */}
            {product.variant_parent && product.variant_parent.length > 0 && (
              <div className="mb-6">
                <h2
                  className="text-lg font-bold mb-3 text-black border-b pb-2 border-gray-300"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
                >
                  Available Variants
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {product.variant_parent.map((variant, index) => (
                    <div
                      key={index}
                      onClick={() => handleVariantSelect(variant)}
                      className={`p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 relative ${
                        selectedVariant === variant.id
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="h-16 flex items-center justify-center mb-2">
                        {variant.variant_primary_image?.image ? (
                          <img
                            src={BaseURL + variant.variant_primary_image.image}
                            alt={variant.product}
                            className="h-full object-contain"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="text-xs font-medium text-black truncate">
                          {variant.variant_product}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {variant.relationship.name}:{" "}
                          <span className="font-semibold">
                            {variant.relationship_value}
                          </span>
                        </p>
                      </div>
                      {selectedVariant === variant.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Action buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 mt-4 justify-center items-stretch"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              <button
                onClick={(e) => handleAddToCart(product.id, e)}
                disabled={addingToCart === product.id}
                className="flex-1 py-2 px-3 rounded-lg font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300
                  bg-gray-200 text-black hover:bg-gray-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                {addingToCart === product.id ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaCartPlus size={12} /> <span>Add To Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 py-2 px-3 rounded-lg font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300 bg-red-100 text-red-600 hover:bg-red-200 hover:-translate-y-1 border border-red-300"
              >
                <FaHeart size={12} /> <span>Add to Wishlist</span>
              </button>
              {token && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2 px-3 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2
                    bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaBolt size={12} /> <span>Buy Now</span>
                </button>
              )}
              <button 
                onClick={handleEnquiry}
                className="flex-1 py-2 px-3 rounded-lg font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300 bg-green-500 text-white hover:bg-green-600 hover:-translate-y-1 border border-green-600"
              >
                <FaWhatsapp size={12} /> <span>Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pop-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fade {
          animation: fade 0.3s ease forwards;
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease forwards;
        }
        .animate-fade-down {
          animation: fade-down 0.5s ease forwards;
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .cursor-grab {
          cursor: grab;
        }
       
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}
export default Details; 