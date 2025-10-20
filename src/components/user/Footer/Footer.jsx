import React from "react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

function MetrixFooter() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-2">METRIX</h2>
            <p className="text-sm text-gray-300">Building Gaming Experiences Since 2020</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/about" className="text-gray-300 hover:text-white text-sm block transition-colors">About</a>
              <a href="/products" className="text-gray-300 hover:text-white text-sm block transition-colors">Products</a>
              <a href="/support" className="text-gray-300 hover:text-white text-sm block transition-colors">Support</a>
              <a href="/contact" className="text-gray-300 hover:text-white text-sm block transition-colors">Contact</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <a href="/gaming-pcs" className="text-gray-300 hover:text-white text-sm block transition-colors">Gaming PCs</a>
              <a href="/peripherals" className="text-gray-300 hover:text-white text-sm block transition-colors">Peripherals</a>
              <a href="/accessories" className="text-gray-300 hover:text-white text-sm block transition-colors">Accessories</a>
              <a href="/workstations" className="text-gray-300 hover:text-white text-sm block transition-colors">Workstations</a>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-sm text-gray-300">Technocraft Sreevalsum Building Temple by Pass Thodupuzha</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="https://wa.me/917920938981" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 text-xl transition-colors">
                <FaWhatsapp />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 text-xl transition-colors">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 text-xl transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300 mb-2 md:mb-0">&copy; 2025 Metrix. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</a>
            <a href="/returns" className="text-sm text-gray-300 hover:text-white transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MetrixFooter;