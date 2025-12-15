import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/UserContext";
import {
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiMenu,
  FiLogIn,
  FiUserPlus,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiX,
  FiHeart
} from "react-icons/fi";
import metrixLogo from "../../../Images/maxtreo-yellow-logo-backgroundremoved.png";
import {
  ListOrdered,
  HeadphonesIcon,
} from "lucide-react";
import { logout } from "../../../Services/userApi";
import { getProductCategories } from "../../../Services/Settings";

function SideBar({ isOpen, onClose, position = "right" }) {
  const { token, setToken, user } = useAuth();
  const navigate = useNavigate();
  const [productsItems, setProductsItems] = useState([]);

  // State for expandable menu items
  const [expandedMenus, setExpandedMenus] = useState({
    categories: false,
    solutions: false,
    support: false,
  });

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      categories: false,
      solutions: false,
      support: false,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      setToken(null);
      localStorage.removeItem("token");
      const refresh = localStorage.getItem("refresh");
      const response = await logout(refresh, token);
      console.log(response, "logout response");
      navigate("/");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfile = () => {
    try {
      navigate("/profile");
      onClose();
    } catch (error) {
      console.error("Profile navigation error:", error);
    }
  };

  // useEffect for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // useEffect to fetch products — runs once on mount, no external deps
  useEffect(() => {
    const getProductDropDownList = async () => {
      try {
        const categories = await getProductCategories();
        console.log(categories, "categories from sidebar");
        const categoryData = Array.isArray(categories) ? categories : (categories.data || []);
        setProductsItems(categoryData);
      } catch (error) {
        console.log(error, "error while fetching category products");
        setProductsItems([]);
      }
    };
    getProductDropDownList();
  }, []); // Empty deps: stable, runs only on mount

  const supportItems = [
    { name: "About Us", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms and Conditions", path: "/teams-and-conditions" },
    { name: "Return & Refunds", path: "/return-refunds" },
    { name: "Shipping Policy", path: "/Shipping-Policy" },
  ];

  const isLeft = position === "left";
  const slideAnimation = isLeft ? "slideInLeft" : "slideInRight";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[1998] transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 z-[1999] h-screen w-full md:w-80 bg-white/90 backdrop-blur-xl shadow-xl transition-transform duration-400 overflow-y-auto ${
          isLeft ? "left-0 border-r" : "right-0 border-l"
        } border-gray-200 transform ${
          isOpen ? "translate-x-0" : (isLeft ? "-translate-x-full" : "translate-x-full")
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <div className="flex flex-col h-full p-6 gap-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <Link to="/">
              <img
                src={metrixLogo}
                alt="Metrix Logo"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </Link>

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
                      className="w-7 h-7 rounded-full bg-blue-500 overflow-hidden cursor-pointer"
                      onClick={handleProfile}
                    >
                      <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
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
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-0.5 p-0 m-0">
              {token && (
                <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.1s` }}>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <FiUser className="mr-3 text-base min-w-4" />
                    <span>Profile</span>
                  </Link>
                </li>
              )}

              <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.1s` }}>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <FiShoppingBag className="mr-3 text-base min-w-4" />
                  <span>Cart</span>
                </Link>
              </li>

              <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.2s` }}>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <FiShoppingBag className="mr-3 text-base min-w-4" />
                  <span>Products</span>
                </Link>
              </li>
                <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.2s` }}>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                >
                  <FiHeart className="mr-3 text-base min-w-4" />
                  <span>wishlist</span>
                </Link>
              </li>

              {/* All Categories - Expandable */}
              <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.3s` }}>
                <div>
                  <button
                    onClick={() => toggleMenu("categories")}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <div className="flex items-center">
                      <FiGrid className="mr-3 text-base min-w-4" />
                      <span>All Categories</span>
                    </div>
                    <div className={`transition-transform duration-300 ${expandedMenus.categories ? "rotate-90" : "rotate-0"}`}>
                      {expandedMenus.categories ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                    </div>
                  </button>

                  <div
                    className={`ml-6 mt-1 space-y-0.5 overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedMenus.categories
                        ? "max-h-[300px] opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-2"
                    }`}
                  >
                    {Array.isArray(productsItems) && productsItems.length > 0 ? (
                      productsItems.map((item, index) => (
                        <Link
                          key={index}
                          to={`/categoryproductlist?categoryId=${item.id}&categoryName=${encodeURIComponent(item.name)}`}
                          onClick={onClose}
                          className="block py-1.5 px-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-all duration-200"
                        >
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <p className="block py-1.5 px-2.5 text-sm text-gray-500 italic">No categories available</p>
                    )}
                  </div>
                </div>
              </li>

              {token && (
                <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.4s` }}>
                  <Link
                    to="/myorder"
                    onClick={onClose}
                    className="flex items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <ListOrdered className="mr-3 text-base min-w-4" />
                    <span>My Order</span>
                  </Link>
                </li>
              )}

              {/* Support - Expandable */}
              <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.5s` }}>
                <div>
                  <button
                    onClick={() => toggleMenu("support")}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <div className="flex items-center">
                      <HeadphonesIcon className="mr-3 text-base min-w-4" />
                      <span>Support</span>
                    </div>
                    <div className={`transition-transform duration-300 ${expandedMenus.support ? "rotate-90" : "rotate-0"}`}>
                      {expandedMenus.support ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
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
                <li className="opacity-0 transform translate-x-5" style={{ animation: `${slideAnimation} 0.4s ease forwards 0.6s` }}>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center py-2.5 px-3 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 hover:translate-x-0.5"
                  >
                    <FiLogOut className="mr-3 text-base min-w-4" />
                    <span>Logout</span>
                  </button>
                </li>
              )}
            </ul>
            <div className="mt-auto pt-6 border-t border-gray-200 opacity-0" style={{ animation: "fadeInUp 0.5s ease forwards", animationDelay: "0.5s" }}>
              <h3 className="flex items-center gap-2 text-sm mb-3 text-gray-700 font-medium">
                <FiMapPin className="text-gray-500" size={16} /> Our Location
              </h3>
              <div className="p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                <h4 className="m-0 mb-1 text-xs font-medium text-gray-800">Address</h4>
                <p className="m-0 text-xs text-gray-600 leading-tight">
                  Sreevalsam Building Temple,<br />
                  By Pass Thodupuzha Near SBI,<br /> 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

export default SideBar;