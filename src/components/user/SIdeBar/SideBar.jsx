import React, { Profiler, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/UserContext";
import {
  FiHome,
  FiShoppingBag,
  FiHelpCircle,
  FiUser,
  FiLogOut,
  FiMenu,
  FiLogIn,
  FiUserPlus,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import metrixLogo from "../../../Images/neo_tokyo-logo.png";
import { BsFillTicketFill } from "react-icons/bs";
import {
  GamepadIcon,
  ListOrdered,
  Settings,
  Cpu,
  HeadphonesIcon,
} from "lucide-react";
import { FaProductHunt } from "react-icons/fa";
import { SlCallOut } from "react-icons/sl";
import { IoBulb } from "react-icons/io5";
import { logout } from "../../../Services/userApi";
import { FiShoppingCart } from "react-icons/fi";
import {getProductDropDown} from '../../../Services/userApi'

function SideBar({ isOpen, onClose }) {
  const { token, setToken, user } = useAuth();
  const navigate = useNavigate();
  const [productsItems, setProductsItems] = useState([]);

  // State for expandable menu items
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    solutions: false,
    support: false,
  });

  const getProductDropDownList = async () => {
    try {
      const response = await getProductDropDown();
      console.log(response, "response form data form navbar items#############........");
      setProductsItems(response);
    } catch (error) {
      console.log(error, "error while fetching category products");
    }
  };
  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      products: false,
      solutions: false,
      support: false,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      setToken(null);
      localStorage.removeItem("token");
      let refresh = localStorage.getItem("refresh");
      const response = await logout(refresh, token);
      console.log(response, "logout response");
      navigate("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    getProductDropDownList();
  }, []);

  const handleProfile = () => {
    try {
      navigate("/profile");
      onClose();
    } catch (error) {
      console.error("Profile navigation error:", error);
    }
  };

  // Menu data
  const solutionsItems = [
    { name: "Photo Editing", path: "/new-Solutions" },
    { name: "Video Editing", path: "/new-Solutions" },
    { name: "3D Design Animation", path: "/new-Solutions" },
    { name: "Real-Time Engine", path: "/new-Solutions" },
    { name: "Rendering", path: "/new-Solutions" },
    { name: "Digital Audio", path: "/new-Solutions" },
    { name: "Architecture CAD", path: "/new-Solutions" },
    { name: "Visualization", path: "/new-Solutions" },
    { name: "Scientific Computing", path: "/new-Solutions" },
    { name: "Live Streaming", path: "/new-Solutions" },
  ];



  const supportItems = [
    { name: "Help", path: "/support" },
    { name: "About Us", path: "/about" },
    // { name: 'Blogs', path: '/blogs' },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms and Conditions", path: "/teams-and-conditions" },
    { name: "Return & Refunds", path: "/return-refunds" },
    { name: "Shipping Policy", path: "/Shipping-Policy" },

  ];

  return (
    <>
      {/* Overlay with blur */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[1998] transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar with glass morphism effect */}
      <div
        className={`fixed top-0 right-0 z-[1999] h-screen w-full md:w-1/2 lg:w-[350px] bg-white/90 backdrop-blur-xl shadow-xl transition-transform duration-400 overflow-y-auto border-l border-gray-200 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex flex-col h-full p-6 gap-2">
          {/* Header row with logo, auth buttons, and close button */}
          <div className="flex items-center justify-between mb-6 pt-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={metrixLogo}
                alt="Metrix Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Auth buttons and close button */}
            <div className="flex items-center gap-2">
              {!token ? (
                <>
                  <button
                    className="flex items-center gap-1 py-1.5 px-3 bg-black text-white font-medium rounded-md border border-black hover:bg-gray-800 transition-all duration-300 text-sm"
                    onClick={() => {
                      onClose();
                      navigate("/login");
                    }}
                  >
                    <FiLogIn size={12} /> Login
                  </button>
                  <button
                    className="flex items-center gap-1 py-1.5 px-3 bg-black text-white font-medium rounded-md border border-black hover:bg-gray-800 transition-all duration-300 text-sm"
                    onClick={() => {
                      onClose();
                      navigate("/login");
                    }}
                  >
                    <FiUserPlus size={12} /> Register
                  </button>
                  
                </>
              ) : (
                <>
                  {user && user.profile_picture_url ? (
                    <div
                      style={{ cursor: "pointer" }}
                      className="w-7 h-7 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center cursor-pointer"
                      onClick={handleProfile}
                    >
                      <img
                        src={user.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer text-xs"
                      onClick={handleProfile}
                    >
                      {user?.first_name?.charAt(0) || "U"}
                    </div>
                  )}
                </>
              )}

              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-black bg-white hover:bg-gray-100 transition-all duration-300"
                onClick={onClose}
              >
                <FiMenu size={18} />
              </button>
            </div>
          </div>

          {/* Rest of the content */}
          <div className="flex-1 overflow-y-auto">
            {/* Menu */}
            <ul className="flex flex-col gap-0.5 p-0 m-0">
              {token && (
                <li
                  className="opacity-0 transform translate-x-5"
                  style={{
                    animation: isOpen
                      ? "slideInRight 0.4s ease forwards 0.2s"
                      : "none",
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <FiUser className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Profile</span>
                  </Link>
                </li>
              )}

              <li
                className="opacity-0 transform translate-x-5"
                style={{
                  animation: isOpen
                    ? "slideInRight 0.4s ease forwards 0.1s"
                    : "none",
                }}
              >
                <Link
                  to="/store"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <FiHome className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Store</span>
                </Link>
              </li>
              <li>
                 <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <FiShoppingBag className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Cart</span>
                </Link>
              </li>
             
                
              {/* Products - Expandable */}
              <li
                className="opacity-0 transform translate-x-5"
                style={{
                  animation: isOpen
                    ? "slideInRight 0.4s ease forwards 0.15s"
                    : "none",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleMenu("products")}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <div className="flex items-center">
                      <FiShoppingBag className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Products</span>
                    </div>
                    <div
                      className={`transition-transform duration-300 ${
                        expandedMenus.products ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      {expandedMenus.products ? (
                        <FiChevronDown size={14} />
                      ) : (
                        <FiChevronRight size={14} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`ml-6 mt-1 space-y-0.5 transition-all duration-500 ease-in-out ${
                      expandedMenus.products
                        ? "max-h-screen opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-2 overflow-hidden"
                    }`}
                  >
                    {productsItems.map((item, index) => (
                      <Link
                                             key={index}
                                             to={`/products/product/${item.slug}`}
                                             state={{ id: item.slug, item: item.name }}
                                             className="block py-1.5 px-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-all duration-200"
                                           >
                                          
                                             {item.name}
                                           </Link>
                    ))}
                  </div>
                </div>
              </li>

              {token && (
                <li
                  className="opacity-0 transform translate-x-5"
                  style={{
                    animation: isOpen
                      ? "slideInRight 0.4s ease forwards 0.2s"
                      : "none",
                  }}
                >
                  <Link
                    to="/myorder"
                    onClick={onClose}
                    className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <ListOrdered className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>My Order</span>
                  </Link>
                </li>
              )}

              {/* Solutions - Expandable */}
              <li
                className="opacity-0 transform translate-x-5"
                style={{
                  animation: isOpen
                    ? "slideInRight 0.4s ease forwards 0.25s"
                    : "none",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleMenu("solutions")}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <div className="flex items-center">
                      <IoBulb className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Solutions</span>
                    </div>
                    <div
                      className={`transition-transform duration-300 ${
                        expandedMenus.solutions ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      {expandedMenus.solutions ? (
                        <FiChevronDown size={14} />
                      ) : (
                        <FiChevronRight size={14} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`ml-6 mt-1 space-y-0.5 transition-all duration-500 ease-in-out ${
                      expandedMenus.solutions
                        ? "max-h-screen opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-2 overflow-hidden"
                    }`}
                  >
                    {solutionsItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={onClose}
                        
                        className="block py-1.5 px-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-all duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              <li
                className="opacity-0 transform translate-x-5"
                style={{
                  animation: isOpen
                    ? "slideInRight 0.4s ease forwards 0.1s"
                    : "none",
                }}
              >
                <Link
                  to="/nvidia"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <Cpu className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Nvidia</span>
                </Link>
              </li>

              {/* Support - Expandable */}
              <li
                className="opacity-0 transform translate-x-5"
                style={{
                  animation: isOpen
                    ? "slideInRight 0.4s ease forwards 0.3s"
                    : "none",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleMenu("support")}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <div className="flex items-center">
                      <HeadphonesIcon className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Support</span>
                    </div>
                    <div
                      className={`transition-transform duration-300 ${
                        expandedMenus.support ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      {expandedMenus.support ? (
                        <FiChevronDown size={14} />
                      ) : (
                        <FiChevronRight size={14} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`ml-6 mt-1 space-y-0.5 overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedMenus.support
                        ? "max-h-[300px] opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-2"
                    }`}
                  >
                    <Link
                      to="/contact"
                      onClick={onClose}
                      className="block py-1.5 px-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-all duration-200"
                    >
                      Contact Us
                    </Link>
                    {supportItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={onClose}
                        className="block py-1.5 px-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-all duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {token && (
                <>
                  <li
                    className="opacity-0 transform translate-x-5"
                    style={{
                      animation: isOpen
                        ? "slideInRight 0.4s ease forwards 0.4s"
                        : "none",
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                    >
                      <FiLogOut className="mr-3 text-base min-w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Configuration section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="flex items-center gap-2 text-sm mb-3 text-gray-700 font-medium">
                <Settings className="text-gray-500" size={16} />
                <span>Metrix.Config</span>
                <span className="text-xs text-gray-400">Coming soon</span>
              </h3>
            </div>

            {/* Locations */}
            <div
              className="mt-auto pt-6 border-t border-gray-200 animate-[fadeInUp_0.5s_ease_forwards] opacity-0"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="flex items-center gap-2 text-sm mb-3 text-gray-700 font-medium">
                <FiMapPin className="text-gray-500" size={16} /> Our Location
              </h3>
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                  <h4 className="m-0 mb-1 text-xs font-medium text-gray-800">
                    HQ - Thodupuzha
                  </h4>
                  <p className="m-0 text-xs text-gray-600 leading-tight">
                    Technocraft Sreevalsum Building,
                    <br />
                    Temple by Pass, Thodupuzha,
                    <br />
                    Kerala - 685584
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations via style tag */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default SideBar;