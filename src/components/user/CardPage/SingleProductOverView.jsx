import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  PlusCircle,
  X,
} from "lucide-react";
import {
  AddDelievryAddress,
  CreateSIngeleOrder,
  getMyDeliveryAddress,
  getMyPrimaryAddress,
} from "../../../Services/userApi";
import BaseURL from "../../../Static/Static";
import RenderRazorpay from "../RazorPay/RenderRazorpay";

function Overview({ product }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    phone_number: "",
    district: "",
    state: "",
    country: "",
  });

  const [newAddress, setNewAddress] = useState({
    delivery_person_name: "",
    phone_number: "",
    district: "",
    state: "",
    country: "",
    zip_code: "",
    address: "",
    is_primary: false,
  });
  const [orderDetails, setOrderDetails] = useState({});

  // Calculate order totals based on single product
  let subtotal;
  if (product.product_details) {
    subtotal = product.product_details
      ? product.product_details.price * quantity
      : 0;
  } else {
    subtotal = product ? product.price * quantity : 0;
  }
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal;
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );
  console.log(selectedAddress)

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await getMyDeliveryAddress();
        setAddresses(response.data);
        // Set the first address as selected by default
        if (response.data.length > 0) {
          const primaryAddress =
            response.data.find((addr) => addr.is_primary) || response.data[0];
          setSelectedAddressId(primaryAddress.id);
        }
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch addresses"
        );
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  // Validation functions
  const validatePhoneNumber = (value) => {
    const pattern = /^\d{10}$/;
    if (!pattern.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const validateTextOnly = (value, fieldName) => {
    const pattern = /^[a-zA-Z\s]+$/;
    if (!pattern.test(value)) {
      return `${fieldName} must contain only letters (no numbers or special characters)`;
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Field-specific validations
    let errors = { ...formErrors };

    if (name === "phone_number" && value) {
      errors.phone_number = validatePhoneNumber(value);
    }

    if (name === "district" && value) {
      errors.district = validateTextOnly(value, "District");
    }

    if (name === "state" && value) {
      errors.state = validateTextOnly(value, "State");
    }

    if (name === "country" && value) {
      errors.country = validateTextOnly(value, "Country");
    }

    setFormErrors(errors);

    setNewAddress({
      ...newAddress,
      [name]: newValue,
    });
  };

  const isFormValid = () => {
    // Check if there are any validation errors
    return !Object.values(formErrors).some((error) => error !== "");
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const errors = {
      phone_number: validatePhoneNumber(newAddress.phone_number),
      district: validateTextOnly(newAddress.district, "District"),
      state: validateTextOnly(newAddress.state, "State"),
      country: validateTextOnly(newAddress.country, "Country"),
    };

    setFormErrors(errors);

    // If there are validation errors, don't submit
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    try {
      setLoading(true);
      const response = await AddDelievryAddress(newAddress);
      const newAddressObj = response.data;

      // Update addresses list
      let updatedAddresses = [...addresses];
      if (newAddressObj.is_primary) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          is_primary: false,
        }));
      }

      setAddresses([...updatedAddresses, newAddressObj]);
      setSelectedAddressId(newAddressObj.id);

      // Reset form
      setNewAddress({
        delivery_person_name: "",
        phone_number: "",
        district: "",
        state: "",
        country: "",
        zip_code: "",
        address: "",
        is_primary: false,
      });

      setFormErrors({
        phone_number: "",
        district: "",
        state: "",
        country: "",
      });

      setShowAddressModal(false);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add address"
      );
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      let getPrimaryAddress = await getMyPrimaryAddress();
      console.log(getPrimaryAddress, "primary address---");
      let productId;
      if (product.product_details) {
        productId = product.product_details.id;
      } else {
        productId = product.id;
      }
      // Create order with the single product
      let order = await CreateSIngeleOrder({
        address_id: selectedAddressId,
        product_id: productId,
        quantity: quantity,
      });

      let newData = order;
      console.log(newData, "order data");

      // Update orderDetails state
      setOrderDetails(newData);

      // Set display after state update
      setDisplayRazorpay(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > (product?.stock || 10)) return; // Assuming product has stock field
    setQuantity(newQuantity);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="text-blue-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="text-blue-500 mb-4">Error: No product selected</div>
      </div>
    );
  }

  return (
    <>
      {displayRazorpay && orderDetails && (
        <RenderRazorpay
          orderDetails={orderDetails}
          setDisplayRazorpay={setDisplayRazorpay}
        />
      )}
      <div className="max-w-6xl mx-auto p-6 bg-white  z-90" style={{zIndex:"1020"}}>
        <div className="mb-8">
          <br />
        </div>

        <div className="flex flex-col lg:flex-row gap-8" style={{maxHeight:"500px",overflow:"scroll"}}>
          {/* Left Column - Address and Items */}
          <div className="flex-1">
            {/* Address Section */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="text-blue-600 mr-2" size={20} />
                  <h2 className="text-lg font-medium text-gray-800">
                    Shipping Address
                  </h2>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                  onClick={() => setShowAddressModal(true)}
                  disabled={loading}
                >
                  <PlusCircle size={16} className="mr-1" /> Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddressId === address.id
                          ? "border-green-500 bg-green-50"
                          : "border-green-200 hover:border-green-300"
                      }`}
                      onClick={() => handleAddressSelect(address.id)}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-medium text-gray-800">
                          {address.delivery_person_name}
                        </div>
                        {address.is_primary && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>{address.address}</p>
                        <p>{address.district}</p>
                        <p>
                          {address.state} {address.zip_code}
                        </p>
                        <p>{address.country}</p>
                        <p className="pt-1">{address.phone_number}</p>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                        <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                          Edit
                        </button>
                        {selectedAddressId === address.id && (
                          <div className="flex items-center text-green-600 text-sm">
                            <Check size={16} className="mr-1" /> Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Section */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <ShoppingBag className="text-blue-600 mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-800">
                  Product Details
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="py-4 flex flex-col sm:flex-row justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                      {product.primary_image &&
                      product.primary_image.length > 0 ? (
                        <img
                          src={BaseURL + product.primary_image[0].image}
                          alt={product.name}
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Available: {product.stock || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:items-end sm:flex-col">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                      >
                        -
                      </button>
                      <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium">
                      INR. {product.price * quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary and Payment */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              {/* Order Summary */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (1 product)</span>
                    <span className="font-medium">
                      INR. {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      INR. {shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">INR. {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Order Total</span>
                      <span className="text-green-600">
                        INR. {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleCreateOrder}
                className={`w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center transition-colors duration-300 shadow-sm ${
                  !selectedAddressId
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={!selectedAddressId || loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>

              {/* Order Status Indicators */}
              <div className="mt-8 flex justify-between items-center">
                {["Cart", "Shipping", "Review", "Payment"].map(
                  (step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            index < 3 ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          {index < 3 ? (
                            <Check size={16} className="text-white" />
                          ) : (
                            <CreditCard size={16} className="text-gray-500" />
                          )}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">
                          {step}
                        </span>
                      </div>
                      {index < 3 && <div className="h-1 w-4 bg-blue-200"></div>}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
                {showAddressModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-24 pb-20 p-2 sm:p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md max-h-[75vh] sm:max-h-[85vh] overflow-y-auto relative">
      {/* Close Button Only - No Heading */}
      <button
        onClick={() => {
          setShowAddressModal(false);
          // Assuming formErrors is cleared similarly; adjust if needed
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors z-10"
        disabled={loading}
        aria-label="Close modal"
      >
        <X size={16} />
      </button>

      <form
        onSubmit={handleAddNewAddress}
        className="p-3 sm:p-4 space-y-3"
        noValidate
      >
        {/* Delivery Person Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            Delivery Person Name*
          </label>
          <input
            type="text"
            name="delivery_person_name"
            value={newAddress.delivery_person_name}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors?.delivery_person_name
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm`}
            placeholder="DELIVERY PERSON NAME"
            required
            disabled={loading}
          />
          {formErrors?.delivery_person_name && (
            <p className="mt-1 text-xs text-red-600 uppercase">
              {formErrors.delivery_person_name}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            Phone Number*
          </label>
          <input
            type="tel"
            name="phone_number"
            value={newAddress.phone_number}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors?.phone_number
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
            placeholder="PHONE NUMBER"
            required
            disabled={loading}
          />
          {formErrors?.phone_number && (
            <p className="mt-1 text-xs text-red-600 uppercase">
              {formErrors.phone_number}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            Address*
          </label>
          <textarea
            name="address"
            value={newAddress.address}
            onChange={handleInputChange}
            className={`w-full border ${
              formErrors?.address
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm`}
            placeholder="FULL ADDRESS"
            required
            rows={2}
            disabled={loading}
          />
          {formErrors?.address && (
            <p className="mt-1 text-xs text-red-600 uppercase">
              {formErrors.address}
            </p>
          )}
        </div>

        {/* District and State - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              District*
            </label>
            <input
              type="text"
              name="district"
              value={newAddress.district}
              onChange={handleInputChange}
              className={`w-full border ${
                formErrors?.district
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm`}
              placeholder="DISTRICT"
              required
              disabled={loading}
            />
            {formErrors?.district && (
              <p className="mt-1 text-xs text-red-600 uppercase">
                {formErrors.district}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              State*
            </label>
            <input
              type="text"
              name="state"
              value={newAddress.state}
              onChange={handleInputChange}
              className={`w-full border ${
                formErrors?.state
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm`}
              placeholder="STATE"
              required
              disabled={loading}
            />
            {formErrors?.state && (
              <p className="mt-1 text-xs text-red-600 uppercase">
                {formErrors.state}
              </p>
            )}
          </div>
        </div>

        {/* Zip Code and Country - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              Zip Code*
            </label>
            <input
              type="text"
              name="zip_code"
              value={newAddress.zip_code}
              onChange={handleInputChange}
              className={`w-full border ${
                formErrors?.zip_code
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              placeholder="ZIP CODE"
              required
              disabled={loading}
            />
            {formErrors?.zip_code && (
              <p className="mt-1 text-xs text-red-600 uppercase">
                {formErrors.zip_code}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              Country*
            </label>
            <input
              type="text"
              name="country"
              value={newAddress.country}
              onChange={handleInputChange}
              className={`w-full border ${
                formErrors?.country
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 uppercase text-sm`}
              placeholder="COUNTRY"
              required
              disabled={loading}
            />
            {formErrors?.country && (
              <p className="mt-1 text-xs text-red-600 uppercase">
                {formErrors.country}
              </p>
            )}
          </div>
        </div>

        {/* Primary Address Checkbox */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="is_primary"
            name="is_primary"
            checked={newAddress.is_primary}
            onChange={handleInputChange}
            className="h-3 w-3 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label
            htmlFor="is_primary"
            className="text-xs text-gray-700 font-bold uppercase leading-tight"
          >
            Set as primary address
          </label>
        </div>

        {/* Form Actions - Compact */}
        <div className="flex flex-col sm:flex-row justify-end pt-3 border-t space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            type="button"
            onClick={() => {
              setShowAddressModal(false);
              // Assuming formErrors is cleared similarly; adjust if needed
            }}
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-blue-500 uppercase"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-blue-500 uppercase"
            disabled={
              loading ||
              Object.values(formErrors || {}).some(
                (error) => error
              )
            }
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default Overview;