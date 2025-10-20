import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Loader from "../Loader/Loader";
import RenderRazorpay from "../RazorPay/RenderRazorpay";
import BaseURL from "../../../Static/Static";
import AddNewAddress from "../Profile/AddNewAddress";
import Overview from "./OverView";
import { useAuth } from '../../../Context/UserContext';

import {
  getMyCart,
  RemoveFromCart,
  cartIncrement,
  cartDecrement,
  CreateOrder,
  getMyDeliveryAddress,
  getMyPrimaryAddress,
} from "../../../Services/userApi";

const CartPage = () => {
  const { user } = useAuth();
  
  const [cartItems, setCartItems] = useState({ items: [], id: null });
  const [guestCart, setGuestCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);

  const [showOverview, setShowOverview] = useState(false);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    amount: 0,
    currency: "INR",
    orderId: null,
    keyId: null,
    razorpayOrderId: null,
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModal, setAddressModal] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

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

  const removeFromGuestCart = (productId) => {
    const currentCart = getGuestCart();
    const updatedCart = currentCart.filter(item => item.productId !== productId);
    saveGuestCart(updatedCart);
  };

  const updateGuestCartQuantity = (productId, action) => {
    const currentCart = getGuestCart();
    const updatedCart = currentCart.map(item => {
      if (item.productId === productId) {
        const newQuantity = action === 'increase' 
          ? item.quantity + 1 
          : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveGuestCart(updatedCart);
  };

  const clearGuestCart = () => {
    sessionStorage.removeItem('guestCart');
    setGuestCart([]);
  };

  const fetchCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        const response = await getMyCart();
        if (response.data) {
          setCartItems(response.data);
        }
      } else {
        const guestCartItems = getGuestCart();
        setGuestCart(guestCartItems);
        
        const transformedCart = {
          items: guestCartItems.map(item => ({
            id: item.productId,
            product: item.productId,
            product_name: item.productName,
            price: item.productPrice,
            quantity: item.quantity,
            primary_image: { 
              image: item.productImage 
            },
            product_stock: 10,
          })),
          id: null
        };
        setCartItems(transformedCart);
      }
    } catch (error) {
      setError("Failed to load cart. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await getMyDeliveryAddress();
      if (response.data?.length > 0) {
        setAddresses(response.data);
        const primary = response.data.find((addr) => addr.is_primary);
        setSelectedAddressId(primary?.id || response.data[0]?.id);
      }
    } catch (error) {
      console.error("Address fetch error:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, [fetchCartItems, fetchAddresses]);

  useEffect(() => {
    const outOfStock = cartItems.items.some(item => item.product_stock < 1);
    setHasOutOfStockItems(outOfStock);
  }, [cartItems.items]);

  const handleQuantityChange = async (productId, action) => {
    try {
      if (user) {
        setCartItems((prev) => ({
          ...prev,
          items: prev.items.map((item) => {
            if (item.product === productId) {
              return {
                ...item,
                quantity:
                  action === "increase"
                    ? item.quantity + 1
                    : Math.max(1, item.quantity - 1),
              };
            }
            return item;
          }),
        }));

        if (action === "increase") {
          await cartIncrement(productId, cartItems.id);
        } else {
          await cartDecrement(productId, cartItems.id);
        }
      } else {
        updateGuestCartQuantity(productId, action);
        setCartItems((prev) => ({
          ...prev,
          items: prev.items.map((item) => {
            if (item.product === productId) {
              return {
                ...item,
                quantity:
                  action === "increase"
                    ? item.quantity + 1
                    : Math.max(1, item.quantity - 1),
              };
            }
            return item;
          }),
        }));
      }
    } catch (error) {
      setError("Failed to update quantity");
      fetchCartItems();
    }
  };

  const handleRemoveItem = async (itemId, productId) => {
    try {
      if (user) {
        setCartItems((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        }));

        await RemoveFromCart(itemId);
      } else {
        removeFromGuestCart(productId);
        setCartItems((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.product !== productId),
        }));
      }
    } catch (error) {
      setError("Failed to remove item");
      fetchCartItems();
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "GEEKY2023") {
      setPromoApplied(true);
      setError(null);
    } else {
      setError("Invalid promo code");
    }
    setTimeout(() => setError(null), 3000);
  };

  const handleCheckout = () => {
    if (!user) {
      setError("Please login to proceed with checkout");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!selectedAddressId) {
      setError("Please select delivery address");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (hasOutOfStockItems) {
      setError("Please remove out-of-stock items to continue");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setShowOverview(true);
  };

  const handlePayment = async () => {
    try {
      const order = await CreateOrder(selectedAddressId);
      const { data } = order;

      setOrderDetails({
        razorpayOrderId: data.raz_order_id,
        currency: data.currency,
        amount: data.amount,
        keyId: data.key,
      });

      setDisplayRazorpay(true);
      setShowOverview(false);
    } catch (error) {
      setError("Payment failed. Please try again.");
    }
  };

  const handleAddressAdded = async () => {
    await fetchAddresses();
    setAddressModal(false);
  };

  const syncGuestCartToUserAccount = async () => {
    try {
      const guestCartItems = getGuestCart();
      if (guestCartItems.length > 0) {
        clearGuestCart();
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  };

  const subtotal = cartItems.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = promoApplied ? 500 : 0;
  const grandTotal = subtotal - discount;
  const isCartEmpty = !cartItems.items?.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />

      {displayRazorpay && (
        <RenderRazorpay
          orderDetails={orderDetails}
          setDisplayRazorpay={setDisplayRazorpay}
        />
      )}

      {addressModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-md p-4 w-full max-w-sm">
            <AddNewAddress
              onClose={() => setAddressModal(false)}
              fetchAddresses={handleAddressAdded}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showOverview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
            <motion.div
              className="bg-white rounded-md w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button
                className="absolute top-2 right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
                onClick={() => setShowOverview(false)}
              >
                ×
              </button>

              <div className="p-4 pt-8">
                <Overview
                  cartItems={cartItems}
                  address={addresses.find((a) => a.id === selectedAddressId)}
                  total={grandTotal}
                  onBack={() => setShowOverview(false)}
                  onConfirm={handlePayment}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-6xl mx-auto px-2 pt-20 pb-8 sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isLoading && cartItems.items.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : isCartEmpty ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3 bg-white rounded-md shadow-sm p-4">
              <h2 className="text-xl font-semibold text-black mb-4">
                YOUR CART {!user && "(Guest)"}
              </h2>

              <div className="space-y-4">
                {cartItems.items.map((item) => (
                  <CartItem
                    key={user ? item.id : item.product}
                    item={item}
                    onRemove={(itemId) => handleRemoveItem(itemId, item.product)}
                    onQuantityChange={handleQuantityChange}
                    isGuest={!user}
                  />
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 bg-white rounded-md shadow-sm p-4">
              <h2 className="text-xl font-semibold text-black mb-2">
                ORDER SUMMARY
              </h2>

              <PromoCodeSection
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoApplied={promoApplied}
                setPromoApplied={setPromoApplied}
                onApply={handleApplyPromo}
              />

              {user ? (
                <AddressSection
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onAddNew={() => setAddressModal(true)}
                />
              ) : (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    Please <Link to="/login" className="font-medium underline">login</Link> to add delivery address and proceed.
                  </p>
                </div>
              )}

              <OrderTotals
                subtotal={subtotal}
                discount={discount}
                grandTotal={grandTotal}
              />

              {user ? (
                <button
                  className={`w-full py-2 rounded font-semibold mt-4 transition-colors text-sm ${
                    !selectedAddressId || hasOutOfStockItems
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                  onClick={handleCheckout}
                  disabled={!selectedAddressId || hasOutOfStockItems}
                >
                  PROCEED TO CHECKOUT
                </button>
              ) : (
                <Link to="/login">
                  <button className="w-full py-2 rounded font-semibold mt-4 bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm">
                    LOGIN TO CHECKOUT
                  </button>
                </Link>
              )}

              {user && !selectedAddressId && addresses.length > 0 && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  Please select a delivery address.
                </p>
              )}

              {hasOutOfStockItems && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  Please remove out-of-stock items.
                </p>
              )}

              {error && (
                <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const EmptyCart = () => (
  <motion.div
    className="text-center py-4 bg-white rounded-md shadow-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
    <Link to="/products">
      <motion.button
        className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue Shopping
      </motion.button>
    </Link>
  </motion.div>
);

const CartItem = ({ item, onRemove, onQuantityChange, isGuest }) => (
  <motion.div
    className="flex flex-col md:flex-row items-start border-b border-gray-100 py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="relative w-20 h-20 mr-0 md:mr-4 flex-shrink-0">
      <img
        src={BaseURL + (item.primary_image?.image || "")}
        alt={item.product_name}
        className="w-full h-full object-cover rounded"
      />
    </div>

    <div className="flex-grow w-full">
      <div className="mb-2">
        <h3 className="text-xs font-medium text-gray-500 uppercase">GAMING PC</h3>
        <h2 className="text-sm font-semibold text-black uppercase">
          THE {item.product_name}
        </h2>
        {isGuest && (
          <span className="inline-block px-1 py-0.5 bg-orange-100 text-orange-700 text-xs rounded mt-1">
            Guest
          </span>
        )}
      </div>

      <div className="mb-2">
        <span className="text-sm font-semibold text-green-600">
          ₹ {item.price.toLocaleString("en-IN")}/-
        </span>
      </div>

      <div className="mb-2">
        <StockStatus stock={item.product_stock} />
        {item.product_stock < 1 && (
          <button
            className="w-full py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 mt-1"
            onClick={() => onRemove(isGuest ? item.product : item.id)}
          >
            Remove Out-of-Stock
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="flex items-center space-x-1 text-gray-500 text-xs hover:text-red-500"
          onClick={() => onRemove(isGuest ? item.product : item.id)}
        >
          <TrashIcon />
          <span>REMOVE</span>
        </button>

        <QuantityControls
          quantity={item.quantity}
          onIncrease={() => onQuantityChange(item.product, "increase")}
          onDecrease={() => onQuantityChange(item.product, "decrease")}
          disabled={item.product_stock < 1}
        />
      </div>
    </div>
  </motion.div>
);

const StockStatus = ({ stock }) => (
  <div className="mb-1">
    <div
      className="inline-flex items-center px-2 py-1 rounded text-xs"
      style={{
        backgroundColor: stock >= 1 ? "rgba(99, 163, 117, 0.1)" : "rgba(255, 0, 0, 0.1)",
      }}
    >
      <span style={{ color: stock >= 1 ? "#63A375" : "red" }}>
        {stock >= 1 ? "In Stock" : "OUT OF STOCK"}
      </span>
    </div>
    {stock < 1 && (
      <p className="text-red-500 text-xs mt-1">
        Please remove this item.
      </p>
    )}
  </div>
);

const QuantityControls = ({ quantity, onIncrease, onDecrease, disabled }) => (
  <div className="flex items-center border border-gray-200 rounded">
    <button
      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-sm"
      onClick={onDecrease}
      disabled={quantity <= 1 || disabled}
    >
      −
    </button>
    <span className="w-5 h-5 text-center border-x border-gray-200 text-sm">
      {quantity}
    </span>
    <button
      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-sm"
      onClick={onIncrease}
      disabled={disabled}
    >
      +
    </button>
  </div>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const PromoCodeSection = ({
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  onApply,
}) => (
  <div className="border border-gray-200 rounded p-2 mb-4 bg-gray-50">
    <p className="text-center font-medium mb-1 text-sm text-gray-700">
      PROMO CODE
    </p>

    {promoApplied ? (
      <div className="bg-white rounded p-1 flex justify-between items-center text-xs">
        <span className="font-medium">GEEKY2023</span>
        <button
          className="text-gray-400"
          onClick={() => setPromoApplied(false)}
        >
          REMOVE
        </button>
      </div>
    ) : (
      <div className="flex">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter code"
          className="flex-grow rounded-l border border-gray-300 px-2 py-1 text-sm focus:outline-none"
        />
        <button
          className="bg-gray-800 text-white px-2 py-1 rounded-r text-sm"
          onClick={onApply}
          disabled={!promoCode}
        >
          APPLY
        </button>
      </div>
    )}
  </div>
);

const AddressSection = ({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
}) => (
  <div className="mb-3">
    <h3 className="text-sm font-medium mb-1">Delivery Address</h3>

    {addresses.length > 0 ? (
      <>
        <div className="space-y-1">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddressId === addr.id}
              onSelect={() => onSelect(addr.id)}
            />
          ))}
        </div>
        <button
          className="mt-1 text-xs font-medium text-green-600 hover:underline"
          onClick={onAddNew}
        >
          + Add New
        </button>
      </>
    ) : (
      <button
        className="w-full py-1 text-xs font-medium text-green-600 hover:underline"
        onClick={onAddNew}
      >
        + Add First Address
      </button>
    )}
  </div>
);

const AddressCard = ({ address, isSelected, onSelect }) => (
  <div
    className={`border p-2 rounded text-xs cursor-pointer transition-colors ${
      isSelected
        ? "border-green-400 bg-green-50"
        : "border-gray-200 hover:bg-gray-50"
    }`}
    onClick={onSelect}
  >
    <div className="flex justify-between">
      <h4 className="font-medium">{address.delivery_person_name}</h4>
      {address.is_primary && (
        <span className="px-1 py-0.5 rounded bg-green-100 text-green-600 text-xs">
          Primary
        </span>
      )}
    </div>
    <p className="text-gray-600">{address.phone_number}</p>
    <p className="text-gray-600">
      {address.address}, {address.district}, {address.state}, {address.country} - {address.zip_code}
    </p>
  </div>
);

const OrderTotals = ({ subtotal, discount, grandTotal }) => (
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Discount</span>
      <span className="text-gray-600">₹ {discount}</span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal</span>
      <span className="text-gray-600">
        ₹ {subtotal.toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-black">
      <span>Grand Total</span>
      <span>
        ₹ {grandTotal.toLocaleString("en-IN")}
      </span>
    </div>
  </div>
);

export default CartPage;