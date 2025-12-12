import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from "../../../Axios/Axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import MobileBottomNavbar from '../NavBar/MobileBottomNavbar';
import { ShoppingCart, Tag } from 'lucide-react';

function CategoryCarousel() {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError('No category slug provided');
      setLoading(false);
      console.log('No slug provided, setting error');
      return;
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching category data for slug: ${slug}`);

        const response = await Axios.get(`/advertisement/product/categories/${slug}/`);
        console.log("Category API Response:", response);
        console.log("Category API Response Data:", response.data);
        
        const sortedProducts = (response.data.category_products || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        console.log("Sorted Products:", sortedProducts);
        
        const updatedCategoryData = {
          ...response.data,
          category_products: sortedProducts
        };
        console.log("Updated Category Data:", updatedCategoryData);
        
        setCategoryData(updatedCategoryData);
      } catch (err) {
        console.error(`Error fetching category ${slug}:`, err);
        console.error("Error details:", err.response || err.message);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchCategoryData();
  }, [slug]);

  useEffect(() => {
    if (categoryData) {
      console.log("Category Data Updated in State:", categoryData);
      console.log("Total Products:", categoryData.total_products);
      console.log("Category Products Length:", categoryData.category_products?.length);
    }
  }, [categoryData]);

  console.log("Component Render - Slug:", slug);
  console.log("Component Render - Loading:", loading);
  console.log("Component Render - Error:", error);
  console.log("Component Render - CategoryData:", categoryData);

  if (loading) {
    console.log("Rendering Loading State");
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    console.log("Rendering Error State", { error, categoryData });
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-red-600">
            <div className="text-lg font-semibold mb-2">Error loading category</div>
            <div className="text-sm">{error || 'Category not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering Main Content with Category Data:", categoryData);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Category Header */}
      <div className="py-10 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {categoryData.name}
            </h1>
            {categoryData.description && (
              <p className="text-gray-600 text-base md:text-lg max-w-3xl">
                {categoryData.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Tag className="w-4 h-4" />
              <span>{categoryData.total_products} {categoryData.total_products === 1 ? 'Product' : 'Products'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-10 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          {categoryData.total_products > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {categoryData.category_products.map((catProd, index) => {
                  const product = catProd.product;
                  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                  const discountPercent = product.discount_price ? Math.round((parseFloat(product.mrp) - parseFloat(product.price)) / parseFloat(product.mrp) * 100) : 0;

                  console.log(`Rendering Product ${index + 1}:`, { productId: product.id, productName: product.name, primaryImage, discountPercent });

                  return (
                    <Link
                      key={product.id}
                      to={`/Details/${product.id}`}
                      className="group flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative h-full"
                    >
                      {/* Yellow accent details */}
                      <div className="absolute top-0 left-0 w-0.5 lg:w-1 h-12 lg:h-16 bg-yellow-400"></div>
                      <div className="absolute top-0 right-0 w-8 lg:w-12 h-0.5 bg-yellow-400"></div>
                      <div className="absolute bottom-0 left-0 w-10 lg:w-16 h-0.5 bg-yellow-400"></div>

                      {/* Product Image */}
                      <div className="relative h-44 lg:h-56 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                        <img
                          src={primaryImage?.image_url || primaryImage?.image || ''}
                          alt={product.name}
                          className="h-32 lg:h-44 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Yellow accent in image area */}
                        <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 w-1.5 lg:w-2 h-8 lg:h-10 bg-yellow-400"></div>
                        {discountPercent > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="flex-1 flex flex-col justify-between p-3 lg:p-5">
                        <div>
                          {/* Brand */}
                          {product.brand_name && (
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium text-center">
                              {product.brand_name}
                            </p>
                          )}

                          {/* Product Name */}
                          <h3 className="font-bold text-base lg:text-xl mb-3 lg:mb-4 line-clamp-2 leading-tight text-gray-900 text-center">
                            {product.name}
                          </h3>

                          {/* Pricing */}
                          <div className="flex items-center justify-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
                            <span className="text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">
                              ₹{parseFloat(product.price).toLocaleString('en-IN')}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-xs lg:text-sm line-through text-gray-400 whitespace-nowrap">
                                ₹{parseFloat(product.mrp).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buy Now Button - Pushed to bottom */}
                        <Link
                          to={`/Details/${product.id}`}
                          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-1.5 lg:py-2 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-base transition-all duration-300"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="whitespace-nowrap">Buy Now</span>
                        </Link>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            console.log("No products available, rendering empty state"),
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-500">
                Check back soon for new products in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNavbar />
    </div>
  );
}

export default CategoryCarousel;