import React from 'react';
import { 
  Building, 
  Info, 
  User, 
  Shield, 
  Phone, 
  Mail, 
  MessageCircle, 
  CreditCard, 
  Smartphone, 
  IndianRupee, 
  Wallet, 
  Facebook, 
  Instagram, 
  Youtube,
  MapPin,
  Truck,
  Headphones,
  Package,
  ChevronRight
} from 'lucide-react';
import MapIframe from "./MapIframe";
import  UPI  from "../../../Images/upi.png"
import  Visa  from "../../../Images/visa-3.png"
import  MasterCard  from "../../../Images/mastercard.png"
import  RuPay  from "../../../Images/rupay.png"
import  Bank  from "../../../Images/bank.png"

const MaxtreoFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 lg:py-12 px-4">
      {/* Features Bar */}
      <div className="py-3 mb-4 lg:mb-6">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="flex flex-row items-center justify-between gap-1 sm:gap-2 lg:gap-4 pb-4 sm:pb-6 lg:pb-8">
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-white truncate">Free Shipping</p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 truncate">Across India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-white truncate">Customer Support</p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 truncate">Expert is here to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-white truncate">Online Payment</p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 truncate">100% Secure</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-white truncate">Fast Delivery</p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 truncate">Fast & reliable</p>
                </div>
              </div>
            </div>
            
            <hr className="absolute bottom-0 left-0 w-full border-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Footer Sections */}
      <div className="container mx-auto mb-6 lg:mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 font-semibold text-white">
              <MapPin className="h-4 w-4 lg:h-6 lg:w-6" />
              <span className="text-sm lg:text-lg">Location</span>
            </h3>
            <hr className="border-gray-600 pb-2" />
            <div className="space-y-2 text-sm">
              <p className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mt-0.5 flex-shrink-0" />
                <span className="text-xs lg:text-sm">
                  Sreevalsam Building <br /> Temple By Pass <br /> Thodupuzha Near SBI
                </span>
              </p>
              <div className="hidden sm:block w-full max-w-[140px] lg:max-w-[150px] h-14 lg:h-16 relative overflow-hidden rounded border border-gray-600">
                <MapIframe />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="flex items-center space-x-2 font-semibold text-white">
              <Building className="h-4 w-4 lg:h-6 lg:w-6" />
              <span className="text-sm lg:text-lg">About</span>
            </h3>
            <hr className="border-gray-600" />
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li>
                <a href="/about" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a href="/support" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="flex items-center space-x-2 font-semibold text-white">
              <User className="h-4 w-4 lg:h-6 lg:w-6" />
              <span className="text-sm lg:text-lg">Account</span>
            </h3>
            <hr className="border-gray-600" />
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li>
                <a href="/profile" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>My Account</span>
                </a>
              </li>
              <li>
                <a href="/myorder" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Track Order</span>
                </a>
              </li>
              <li>
                <a href="/Cart" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Cart</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Policy Section */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="flex items-center space-x-2 font-semibold text-white">
              <Shield className="h-4 w-4 lg:h-6 lg:w-6" />
              <span className="text-sm lg:text-lg">Policy</span>
            </h3>
            <hr className="border-gray-600" />
            <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li>
                <a href="/privacy-policy" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="/return-refunds" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Refund Policy</span>
                </a>
              </li>
              <li>
                <a href="/Shipping-policy" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Shipping Policy</span>
                </a>
              </li>
              <li>
                <a href="/teams-and-conditions" className="flex items-center space-x-2 hover:text-white transition-colors w-full py-1">
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Terms & Conditions</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment System and Social Links */}
      <div className="border-t border-gray-700 pt-6 lg:pt-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-white items-center">
            <h4 className="flex items-center space-x-2 font-medium text-sm lg:text-base">
              <CreditCard className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Payment System:</span>
            </h4>
            <div className="flex space-x-2 lg:space-x-3">
  <div
    className="p-1 lg:p-2 bg-gray-700 rounded flex items-center justify-center"
    title="UPI"
  >
    <img
      src={UPI}
      alt="UPI"
      className="h-4 w-4 lg:h-5 lg:w-5 object-contain"
    />
  </div>

  <div
    className="p-1 lg:p-2 bg-gray-700 rounded flex items-center justify-center"
    title="Visa"
  >
    <img
      src={Visa}
      alt="Visa"
      className="h-4 w-4 lg:h-5 lg:w-5 object-contain"
    />
  </div>

  <div
    className="p-1 lg:p-2 bg-gray-700 rounded flex items-center justify-center"
    title="RuPay"
  >
    <img
      src={RuPay}
      alt="RuPay"
      className="h-4 w-4 lg:h-5 lg:w-5 object-contain"
    />
  </div>

  <div
    className="p-1 lg:p-2 bg-gray-700 rounded flex items-center justify-center"
    title="master-card"
  >
    <img
      src={MasterCard}
      alt="master-card"
      className="h-4 w-4 lg:h-5 lg:w-5 object-contain"
    />
  </div>
    <div
    className="p-1 lg:p-2 bg-gray-700 rounded flex items-center justify-center"
    title="Bank"
  >
    <img
      src={Bank}
      alt="Bank"
      className="h-4 w-4 lg:h-5 lg:w-5 object-contain"
    />
  </div>
</div>
      
          </div>


          <div className="flex space-x-3 lg:space-x-4">
            <h4 className="sr-only">Our Social Links:</h4>
            <a href="https://facebook.com" className="p-2 hover:bg-gray-700 rounded transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 lg:h-5 lg:w-5" />
            </a>
            <a href="https://instagram.com" className="p-2 hover:bg-gray-700 rounded transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
            </a>
            <a href="https://youtube.com" className="p-2 hover:bg-gray-700 rounded transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4 lg:h-5 lg:w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 pt-4 mt-6 lg:mt-8 text-center">
        <p className="text-xs lg:text-sm text-gray-400">&copy; 2025 maxtreo. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-4 lg:space-x-6 mt-2">
          <a href="/privacy" className="text-xs lg:text-sm hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="text-xs lg:text-sm hover:text-white transition-colors">Terms of Service</a>
          <a href="/returns" className="text-xs lg:text-sm hover:text-white transition-colors">Returns</a>
        </div>
      </div>
    </footer>
  );
};

export default MaxtreoFooter;