// components/user/NavBar/MobileBottomNavbar.jsx - Updated component
// Removed "Products" tab, added "Wishlist" tab.
// Adjusted grid to maintain 3 columns.
// Added Wishlist icon (heart SVG for consistency).
// Wishlist links to "/wishlist".
// Reordered: Wishlist (left), Login (middle), Cart (right).
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation for active states; adjust if no Router

const MobileBottomNavbar = () => {
  const location = useLocation(); // For highlighting active tab
  // Example cart item count; replace with real state/context (e.g., useCart hook)
  const cartItemCount = 3; // Hardcoded for demo; use useState or context in production

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden dark:bg-gray-700 dark:border-gray-600 shadow-lg">
      {/* Added shadow-lg for subtle elevation */}
      <div className="grid h-16 max-w-lg grid-cols-3 mx-auto px-2">
        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`inline-flex flex-col items-center justify-center py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive('/wishlist')
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          aria-label="Wishlist"
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs">Wishlist</span>
        </Link>

        {/* Login */}
        <Link
          to="/login"
          className={`inline-flex flex-col items-center justify-center py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive('/login')
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          aria-label="Login"
        >
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Login</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className={`inline-flex flex-col items-center justify-center py-2 text-sm font-medium rounded-md transition-colors duration-200 relative ${
            isActive('/cart')
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          aria-label="Cart"
        >
         <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11v-5a3 3 0 0 1 6 0v5" />
</svg>
          {/* Cart badge - conditional render */}
          {/* {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-700">
              {cartItemCount}
            </span>
          )} */}
          <span className="text-xs">Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNavbar;