// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "../Axios/Axios";
import NavBar from "../components/user/NavBar/NavBar";
import Footer from "../components/user/Footer/Footer";
import ReusableCarousel from '../components/user/Carousel/ReusableCarousel';
import ProductHighlights from '../components/user/Products/ProductHighlights';
import PopularCategory from '../components/user/Category/PopularCategory';
import MobileBottomNavbar from '../components/user/NavBar/MobileBottomNavbar';
import SearchBarNav from '../components/user/NavBar/SearchBarNav';

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to split array into n chunks as evenly as possible (kept for potential future use, but not needed now)
  const chunkArray = (arr, n) => {
    const chunks = [];
    const chunkSize = Math.floor(arr.length / n);
    const remainder = arr.length % n;
    let start = 0;
    for (let i = 0; i < n; i++) {
      const end = start + (chunkSize + (i < remainder ? 1 : 0));
      chunks.push(arr.slice(start, end));
      start = end;
    }
    return chunks;
  };

  useEffect(() => {
    const fetchCategoriesAndDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch all categories
        const categoriesResponse = await Axios.get('/advertisement/product/categories/');
        console.log("Categories API Response:", categoriesResponse.data);
        const sortedCategories = [...(categoriesResponse.data || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCategories(sortedCategories);

        // Step 2: Take first 5 categories (or fewer if less available)
        const selectedCategories = sortedCategories.slice(0, 5);
        console.log("Selected categories (up to 5):", selectedCategories.map(c => c.slug));

        // Step 3: Fetch details for each selected category in parallel
        const detailsPromises = selectedCategories.map(cat => 
          Axios.get(`/advertisement/product/categories/${cat.slug}/`)
            .then(res => ({
              ...cat,
              ...res.data,
              hero_carousels: (res.data.hero_carousels || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            }))
            .catch(err => {
              console.error(`Error fetching details for ${cat.slug}:`, err);
              return { ...cat, hero_carousels: [], category_products: [], total_products: 0 };
            })
        );

        const detailsResponses = await Promise.all(detailsPromises);
        setCategoryDetails(detailsResponses);
      } catch (err) {
        console.error('Error fetching categories or details:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndDetails();
  }, []);

  // Confirm state update
  useEffect(() => {
    console.log("Updated categoryDetails:", categoryDetails);
  }, [categoryDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        {/* <div className="text-lg">Loading home page...</div> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        <div className="text-lg">Error loading data: {error}</div>
      </div>
    );
  }

  // Assign to 5 sections (pad with empty if fewer than 5)
  const getSectionData = (index) => categoryDetails[index] || { hero_carousels: [], slug: '' };
  const leftLargeData = getSectionData(0).hero_carousels;
  const rightTopData = getSectionData(1).hero_carousels;
  const rightBottomData = getSectionData(2).hero_carousels;
  const leftBottomData = getSectionData(3).hero_carousels;
  const rightBottomDataNew = getSectionData(4).hero_carousels;

  const getCategorySlug = (index) => getSectionData(index).slug || '';

  // Navigation handler for carousel clicks/buttons (override to category page)
  const handleCarouselClick = (categorySlug) => {
    if (categorySlug) {
      navigate(`/category/${categorySlug}`);
    }
  };

  console.log("Section carousel lengths:", {
    leftLarge: leftLargeData.length,
    rightTop: rightTopData.length,
    rightBottom: rightBottomData.length,
    leftBottom: leftBottomData.length,
    rightBottomNew: rightBottomDataNew.length
  });

  return (
    <div>
      <NavBar />
      {/* Mobile-only SearchBarNav under NavBar */}
      <div className="block md:hidden">
        <SearchBarNav />
      </div>
      {/* Top area: left large (2/3) and right column with two stacked carousels (1/3) */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-8 overflow-hidden">
        {/* Left large */}
        {leftLargeData.length > 0 && (
          <div className="w-full lg:w-2/3 aspect-video lg:aspect-auto lg:h-[500px] overflow-hidden flex-shrink-0 relative">
            <ReusableCarousel
              data={leftLargeData}
              slidesPerView={1}
              speed={500}
              autoplayDelay={leftLargeData.length > 1 ? 4000 : 0}
              width="100%"
              height="100%"
              onSlideClick={(slide) => handleCarouselClick(getCategorySlug(0))} // 👈 Accept slide param for consistency
            />
          </div>
        )}

        {/* Right column: two carousels — side-by-side on mobile, stacked on lg */}
        <div className="w-full flex flex-row lg:flex-col gap-2 lg:gap-4 lg:w-1/3 overflow-hidden">
          {rightTopData.length > 0 && (
            <div className="flex-1 min-w-0 aspect-video lg:aspect-auto lg:h-[240px] overflow-hidden relative">
              <ReusableCarousel
                data={rightTopData}
                slidesPerView={1}
                speed={500}
                autoplayDelay={rightTopData.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
                onSlideClick={(slide) => handleCarouselClick(getCategorySlug(1))}
              />
            </div>
          )}

          {rightBottomData.length > 0 && (
            <div className="flex-1 min-w-0 aspect-video lg:aspect-auto lg:h-[240px] overflow-hidden relative">
              <ReusableCarousel
                data={rightBottomData}
                slidesPerView={1}
                speed={300}
                autoplayDelay={rightBottomData.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
                onSlideClick={(slide) => handleCarouselClick(getCategorySlug(2))}
              />
            </div>
          )}
        </div>
      </div>

      {/* ProductHighlights */}
      <div className="overflow-hidden">
        <ProductHighlights />
      </div>

      {/* PopularCategory */}
      <div className="overflow-hidden">
        <PopularCategory />
      </div>

      {/* Bottom side-by-side carousels */}
      <div className="flex flex-row gap-2 p-4 md:p-8 overflow-hidden">
        {leftBottomData.length > 0 && (
          <div className="flex-1 min-w-0 aspect-video overflow-hidden relative">
            <ReusableCarousel
              data={leftBottomData}
              slidesPerView={1}
              speed={500}
              autoplayDelay={leftBottomData.length > 1 ? 4000 : 0}
              width="100%"
              height="100%"
              onSlideClick={(slide) => handleCarouselClick(getCategorySlug(3))}
            />
          </div>
        )}

        {rightBottomDataNew.length > 0 && (
          <div className="flex-1 min-w-0 aspect-video overflow-hidden relative">
            <ReusableCarousel
              data={rightBottomDataNew}
              slidesPerView={1}
              speed={500}
              autoplayDelay={rightBottomDataNew.length > 1 ? 4000 : 0}
              width="100%"
              height="100%"
              onSlideClick={(slide) => handleCarouselClick(getCategorySlug(4))}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
      <MobileBottomNavbar />
    </div>
  );
}

export default Home;