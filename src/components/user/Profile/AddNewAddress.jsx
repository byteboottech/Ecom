import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AddDelievryAddress } from '../../../Services/userApi';

function AddNewAddress({ onAddressAdded, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const [newAddress, setNewAddress] = useState({
    delivery_person_name: '',
    phone_number: '',
    address: '',
    district: '',
    state: '',
    zip_code: '',
    country: '',
    is_primary: false
  });

  const validateForm = () => {
    const errors = {};
    
    // Name validation - letters only
    if (newAddress.delivery_person_name && !/^[A-Za-z\s]+$/.test(newAddress.delivery_person_name)) {
      errors.delivery_person_name = 'Name should contain only letters';
    }
    
    // Phone validation
    if (newAddress.phone_number && !/^[0-9]{10}$/.test(newAddress.phone_number)) {
      errors.phone_number = 'Phone number must be 10 digits';
    }
    
    // Letters-only validation
    if (newAddress.district && !/^[A-Za-z\s]+$/.test(newAddress.district)) {
      errors.district = 'District should contain only letters';
    }
    
    if (newAddress.state && !/^[A-Za-z\s]+$/.test(newAddress.state)) {
      errors.state = 'State should contain only letters';
    }
    
    // Zip code validation
    if (newAddress.zip_code && !/^[0-9A-Za-z\s-]+$/.test(newAddress.zip_code)) {
      errors.zip_code = 'Please enter a valid zip code';
    }
    
    if (newAddress.country && !/^[A-Za-z\s]+$/.test(newAddress.country)) {
      errors.country = 'Country should contain only letters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      newAddress.delivery_person_name &&
      newAddress.phone_number &&
      newAddress.address &&
      newAddress.district &&
      newAddress.state &&
      newAddress.zip_code &&
      newAddress.country &&
      Object.keys(formErrors).length === 0
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setNewAddress(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await AddDelievryAddress(newAddress);
      console.log('Address added successfully:', response);
      
      if (onAddressAdded) {
        onAddressAdded(response.data);
      }
      if (onClose) {
        onClose();
      }
      
      // Reload the page after successful submission (optional; consider removing for better UX)
      window.location.reload();
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <div className="fixed inset-0 pt-24 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1020]"> 
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto">
          {/* Integrated header directly into form - no separate div/border for reduced height */}
          <form onSubmit={handleAddNewAddress} className="p-3 space-y-3">
            {/* Header as first form element */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add New Address</h3>
              <button 
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                disabled={loading}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Person Name* (letters only)
              </label>
              <input
                type="text"
                name="delivery_person_name"
                value={newAddress.delivery_person_name}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.delivery_person_name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                placeholder="Full name"
                required
                minLength={1}
                maxLength={255}
                disabled={loading}
              />
              {formErrors.delivery_person_name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.delivery_person_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phone_number"
                value={newAddress.phone_number}
                onChange={handleInputChange}
                className={`w-full border ${formErrors.phone_number ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                placeholder="10 digit phone number"
                required
                maxLength={10}
                disabled={loading}
                pattern="[0-9]{10}"
              />
              {formErrors.phone_number && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone_number}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <textarea
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
                placeholder="Street address, house number, etc."
                required
                minLength={1}
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District* (letters only)
                </label>
                <input
                  type="text"
                  name="district"
                  value={newAddress.district}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                  placeholder="District"
                  required
                  minLength={1}
                  maxLength={20}
                  disabled={loading}
                />
                {formErrors.district && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State* (letters only)
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                  placeholder="State"
                  required
                  minLength={1}
                  maxLength={20}
                  disabled={loading}
                />
                {formErrors.state && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code*
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={newAddress.zip_code}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.zip_code ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                  placeholder="Zip code"
                  required
                  minLength={1}
                  maxLength={10}
                  disabled={loading}
                />
                {formErrors.zip_code && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.zip_code}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country* (letters only)
                </label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm`}
                  placeholder="Country"
                  required
                  minLength={1}
                  maxLength={20}
                  disabled={loading}
                />
                {formErrors.country && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="is_primary"
                name="is_primary"
                checked={newAddress.is_primary}
                onChange={handleInputChange}
                className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                disabled={loading}
              />
              <label htmlFor="is_primary" className="text-sm text-gray-700 select-none">
                Set as primary address
              </label>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end pt-3 border-t mt-4 space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewAddress;