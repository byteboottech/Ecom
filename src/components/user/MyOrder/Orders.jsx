import React, { useState, useEffect } from "react";
import { getMyOrder } from "../../../Services/userApi";
// import image_on_tokyo from "../../../Images/back_ground1.jpg";
import {
  Package,
  Truck,
  Check,
  ShoppingBag,
  X,
  AlertCircle,
  ChevronRight,
  Map,
  DollarSign,
  CreditCard,
  Eye,
  Moon,
  Sun,
  Download,
} from "lucide-react";
import Loader from "../../../Loader/Loader";
import { useAuth } from "../../../Context/UserContext";
import { getInvoices } from "../../../Services/userApi";
import OrderRepay from "./OrderRepay";
import userAvatar from "../../../Images/pro.jpg";
import BaseURL from "../../../Static/Static";
export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFullDetailsModal, setShowFullDetailsModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const renderProfileImage = () => {
    if (!user) {
      return <Loader />;
    }
    if (user.profile_picture) {
      console.log(user);
      return (
        <img
          src={`${BaseURL}${user.profile_picture}`}
          alt="Profile_pic"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (user.profile_picture_url) {
      return (
        <img
          src={user.profile_profile_url}
          alt="Profile"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else {
      return (
        <img
          src={userAvatar} // Replace with your default image path
          alt="Default Profile"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            // Fallback to initials if default image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }
  };
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyOrder();
      if (response && response.data) {
        setOrders(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getStatusConfig = (status) => {
    const statusMap = {
      DELIVERED: {
        icon: <Check className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Delivered",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        stepCompleted: 4,
      },
      SHIPPED: {
        icon: <Truck className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Shipped",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        stepCompleted: 3,
      },
      PROCESSING: {
        icon: <Package className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Processing",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        stepCompleted: 1,
      },
      PAID: {
        icon: <DollarSign className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Paid",
        color: "text-violet-600",
        bgColor: "bg-violet-50",
        stepCompleted: 2,
      },
      CANCELED: {
        icon: <X className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Canceled",
        color: "text-red-600",
        bgColor: "bg-red-50",
        stepCompleted: -1,
      },
      PENDING: {
        icon: <AlertCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />,
        label: "Pending",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        stepCompleted: 0,
      },
    };
    return statusMap[status?.toUpperCase()] || statusMap.PENDING;
  };
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.order_status?.toLowerCase() === filterStatus.toLowerCase()
        );
  const currentOrder = orders.find((order) => order.id === selectedOrder) || {};
  const openOrderModal = () => {
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setShowOrderModal(true);
    }, 500);
  };
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };
  const openFullDetailsModal = () => {
    setShowFullDetailsModal(true);
    setShowOrderModal(false); // Close the order modal if open
  };
  const closeFullDetailsModal = () => {
    setShowFullDetailsModal(false);
  };
  const handlePaymentSuccess = () => {
    fetchMyOrders();
    if (showOrderModal) {
      closeOrderModal();
    } else if (showFullDetailsModal) {
      closeFullDetailsModal();
    }
  };
  const OrderStatusTimeline = ({ order }) => {
    const statusConfig = getStatusConfig(order.order_status);
    const steps = [
      {
        key: "placed",
        label: "Order Placed",
        description: "Your order has been placed",
        icon: ShoppingBag,
        completed: statusConfig.stepCompleted >= 0,
      },
      {
        key: "processing",
        label: "Processing",
        description: "Your order is being processed",
        icon: Package,
        completed: statusConfig.stepCompleted >= 1,
      },
      {
        key: "shipped",
        label: "Shipped",
        description: "Your order has been shipped",
        icon: Truck,
        completed: statusConfig.stepCompleted >= 2,
      },
      {
        key: "outForDelivery",
        label: "Out for Delivery",
        description: "Your order is out for delivery",
        icon: Map,
        completed: statusConfig.stepCompleted >= 3,
      },
      {
        key: "delivered",
        label: "Delivered",
        description: "Your order has been delivered",
        icon: Check,
        completed: statusConfig.stepCompleted >= 4,
      },
    ];
    return (
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute left-4 sm:left-6 top-0 w-px h-full bg-gray-200"></div>
        <div className="space-y-4 sm:space-y-6">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-start relative">
              <div
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                  step.completed
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {React.createElement(step.icon, { className: "w-3 h-3 sm:w-4 sm:h-4" })}
              </div>
              <div className="ml-4 sm:ml-6">
                <h4 className="font-medium text-sm sm:text-base text-black">{step.label}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                {step.key === "placed" && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Order ID: {order.payment_order_id}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen p-4 sm:p-6 bg-white text-black"
      >
        <AlertCircle className="w-12 h-12 sm:w-[48px] sm:h-[48px] text-red-500 mb-4" />
        <h2 className="text-lg sm:text-xl font-bold mb-2">Unable to Load Orders</h2>
        <p className="text-center mb-4 text-sm sm:text-base">{error}</p>
        <button
          onClick={fetchMyOrders}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen p-4 sm:p-6 bg-white text-black"
      >
        <ShoppingBag className="w-12 h-12 sm:w-[48px] sm:h-[48px] text-gray-400 mb-4" />
        <h2 className="text-lg sm:text-xl font-bold mb-2">No Orders Found</h2>
        <p className="text-center mb-6 text-sm sm:text-base">
          You haven't placed any orders yet. Browse our products and start
          shopping!
        </p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Browse Products
        </button>
      </div>
    );
  }
  return (
    <div
      className=""
      style={{ fontFamily: "'Rajdhani', sans-serif", marginTop: "100px" }}
    >
      <div
        className="w-full h-full min-h-screen bg-gray-50 text-black"
        style={{
          width: "90%",
          margin: "auto",
          gap: "10px",
          background: "none",
        }}
      >
        <div
          className="w-full bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div
            className="p-3 sm:p-4 flex items-start bg-gradient-to-r from-slate-50 to-gray-50"
            style={{ width: "100%", marginBottom: "10px" }}
          >
            <div
              className="flex flex-col sm:flex-row flex-wrap bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 w-full items-start sm:items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full border-2 border-gray-200 mr-0 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0">
                {user ? renderProfileImage() : <Loader />}
              </div>
              {/* User Information Section */}
              <div className="flex-1 min-w-0 space-y-2 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-base sm:text-lg font-semibold text-black truncate">
                    {user
                      ? `${user.first_name || ""} ${
                          user.last_name || ""
                        }`.trim() || "User"
                      : "Loading..."}
                  </h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg
                      className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm truncate">
                      {user ? user.email : "email@loading..."}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg
                      className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm">
                      {user ? user.phone_number : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
              {/* Action Button */}
              <div className="pt-2 w-full sm:pt-0 sm:w-auto">
                <a
                  href="/my-products"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm w-full sm:w-auto justify-center"
                >
                  <svg
                    className="w-3 sm:w-4 h-3 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  My Products
                </a>
              </div>
            </div>
          </div>
          <div className="p-0">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-0">
              <h1 className="text-lg sm:text-xl font-bold text-black">My Orders</h1>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs sm:text-sm rounded-md border bg-white border-gray-300 py-1 px-2 sm:px-3 w-full sm:w-auto"
                >
                  <option value="all">All Orders</option>
                  <option value="delivered">Delivered</option>
                  <option value="shipped">Shipped</option>
                  <option value="processing">Processing</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <div
                  className="p-8 sm:p-12 text-center text-gray-500"
                >
                  <p className="mb-4 text-sm sm:text-base">No orders match the selected filter.</p>
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                  >
                    Show All Orders
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.order_status);
                  const address = order?.delivery_address_details || {};
                  const fullAddress = [
                    address.delivery_person_name || '',
                    address.address || '',
                    `${address.district || ''}, ${address.state || ''}, ${address.postal_code || ''}`,
                    address.country || '',
                    address.phone_number || ''
                  ].filter(Boolean).join(', ');
                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order.id);
                        openOrderModal();
                      }}
                      className="p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-start group"
                    >
                      {/* Left Column: Order ID */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-blue-500">Order Id</h4>
                            <p className="text-xs text-gray-600"># {order.invoice_number}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </div>
                      {/* Middle Column: Delivery Address */}
                      <div className="space-y-1 md:col-span-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-500">Delivery address</h4>
                        <p className="text-xs sm:text-sm font-medium text-black">{address.delivery_person_name || 'Not specified'}</p>
                        <p className="text-xs text-gray-600 leading-tight max-w-xs break-words">{fullAddress}</p>
                      </div>
                      {/* Right Column: Payment Overline */}
                      <div className="space-y-1 text-left sm:text-right">
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-500">Payment Overline</h4>
                        <p className="text-xs sm:text-sm font-semibold text-black">₹ {order.total_price}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                          {order.order_status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Order Overlay Modal Card */}
      {modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <Loader />
          </div>
        </div>
      )}
      {showOrderModal && currentOrder && Object.keys(currentOrder).length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4" style={{zIndex: 1050}}>
          <div
            className="relative w-full max-w-sm sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-white text-black border border-gray-200"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b bg-white">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  getStatusConfig(currentOrder.order_status).bgColor
                } ${getStatusConfig(currentOrder.order_status).color}`}>
                  {currentOrder.order_status}
                </div>
                <h2 className="text-lg sm:text-xl font-bold truncate">{currentOrder.invoice_number && `Order #${currentOrder.invoice_number}`}</h2>
              </div>
              <button
                onClick={closeOrderModal}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="text-xs sm:text-sm text-gray-500 text-center">
                <span>Order ID: {currentOrder.payment_order_id}</span>
                <span className="mx-2">•</span>
                <span>Placed on: {formatDate(currentOrder.created_at)}</span>
              </div>
              {/* Payment Section for Order Modal */}
              {(currentOrder.payment_status === "PENDING" || currentOrder.payment_status === "FAILED") && (
                <OrderRepay
                  orderId={currentOrder.id}
                  orderAmount={parseFloat(currentOrder.total_price)}
                  onSuccess={handlePaymentSuccess}
                />
              )}
              {/* Order Status Timeline */}
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-black flex items-center text-sm sm:text-base">
                  <Truck className="w-4 h-4 sm:w-[18px] sm:h-[18px] mr-2" />
                  Order Status
                </h3>
                <OrderStatusTimeline order={currentOrder} />
              </div>
              {/* Items Summary */}
              <div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-black text-sm sm:text-base">Order Items</h3>
                <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white flex-shrink-0 overflow-hidden">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <Package className="w-5 h-5 sm:w-6 sm:h-6 m-auto text-gray-400 absolute inset-0 flex items-center justify-center" style={{display: 'none'}} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} • ₹{item.price}</p>
                        </div>
                        <p className="font-medium text-xs sm:text-sm text-black">₹{item.total_price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-3 sm:py-4 text-xs sm:text-sm">No items available.</p>
                  )}
                  {currentOrder.items && currentOrder.items.length > 3 && (
                    <p
                      className="text-center text-xs sm:text-sm text-blue-600 cursor-pointer hover:underline transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFullDetailsModal();
                      }}
                    >
                      +{currentOrder.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    getInvoices(currentOrder.id);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullDetailsModal();
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>More Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Full Details Modal */}
      {showFullDetailsModal && currentOrder && Object.keys(currentOrder).length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4" style={{zIndex: 1060}}>
          <div
            className="relative w-full max-w-md sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl bg-white text-black border border-gray-200"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b bg-white">
              <h2 className="text-xl sm:text-2xl font-bold">{currentOrder.invoice_number && `Order Details #${currentOrder.invoice_number}`}</h2>
              <button
                onClick={closeFullDetailsModal}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold mb-3 sm:mb-4 text-black text-sm sm:text-base">Items in Your Order</h3>
                <div className="space-y-3 sm:space-y-4">
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-4"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 m-auto text-gray-400 mt-2" />
                          )}
                        </div>
                        <div className="flex-grow w-full sm:w-auto">
                          <div className="font-medium text-sm sm:text-base text-black">{item.product_name}</div>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                            <span>Price: ₹{item.price}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto">
                          <div className="font-medium text-sm sm:text-base text-black">₹{item.total_price}</div>
                          {item.product_discount && parseFloat(item.product_discount) > 0 && (
                            <div className="text-xs sm:text-sm text-green-600">Save ₹{item.product_discount}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      No items available for this order.
                    </div>
                  )}
                </div>
              </div>
              {/* Order Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Shipping Details */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold flex items-center text-black text-sm sm:text-base">
                    <Truck className="w-4 h-4 sm:w-[18px] sm:h-[18px] mr-2" />
                    Shipping Details
                  </h3>
                  {currentOrder.delivery_address_details ? (
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">Recipient:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.delivery_person_name || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">Address:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.address || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">City:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.district || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">State:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.state || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">Postal Code:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.postal_code || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <span className="text-gray-500">Phone:</span>
                        <span className="col-span-1 sm:col-span-2">{currentOrder.delivery_address_details.phone_number || "Not specified"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No shipping details available.</p>
                  )}
                </div>
                {/* Payment Information */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center text-black text-sm sm:text-base">
                      <CreditCard className="w-4 h-4 sm:w-[18px] sm:h-[18px] mr-2" />
                      Payment Information
                    </h3>
                    <button
                      onClick={() => getInvoices(currentOrder.id)}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Invoice
                    </button>
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      <span className="text-gray-500">Method:</span>
                      <span className="col-span-1 sm:col-span-2">{currentOrder.payment_method || "Not specified"}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      <span className="text-gray-500">Status:</span>
                      <span className="col-span-1 sm:col-span-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentOrder.payment_status === "SUCCESS"
                              ? "bg-green-100 text-green-800"
                              : currentOrder.payment_status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {currentOrder.payment_status}
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="col-span-1 sm:col-span-2">{currentOrder.payment_order_id || "Not available"}</span>
                    </div>
                  </div>
                  {/* Order Summary */}
                  <div>
                    <h4 className="font-semibold mb-2 sm:mb-3 text-black text-sm sm:text-base">Order Summary</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Subtotal:</span>
                        <span>₹{currentOrder.price_before_tax || "0.00"}</span>
                      </div>
                      {currentOrder.total_discount && parseFloat(currentOrder.total_discount) !== 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">Discount:</span>
                          <span className="text-green-600">-₹{Math.abs(parseFloat(currentOrder.total_discount)).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Tax:</span>
                        <span>₹{currentOrder.total_tax || "0.00"}</span>
                      </div>
                      <div className="flex justify-between pt-1 sm:pt-2 border-t border-gray-200 font-semibold text-xs sm:text-sm">
                        <span>Total:</span>
                        <span>₹{currentOrder.total_price || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                  {/* Payment Section for Details Modal - Different styling */}
                  {(currentOrder.payment_status === "PENDING" || currentOrder.payment_status === "FAILED") && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <OrderRepay
                        orderId={currentOrder.id}
                        orderAmount={parseFloat(currentOrder.total_price)}
                        onSuccess={handlePaymentSuccess}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 flex justify-end">
              <button
                onClick={closeFullDetailsModal}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-medium text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}