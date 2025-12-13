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

  // Function to split array into n chunks as evenly as possible (kept for potential future use)
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

        // Step 2: Fetch details for ALL categories in parallel
        const detailsPromises = sortedCategories.map(cat => 
          Axios.get(`/advertisement/product/categories/${cat.slug}/`)
            .then(res => {
              console.log(`Details API Response for ${cat.slug}:`, res.data);
              return {
                ...cat,
                ...res.data,
                hero_carousels: (res.data.hero_carousels || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              };
            })
            .catch(err => {
              console.error(`Error fetching details for ${cat.slug}:`, err);
              return { ...cat, hero_carousels: [], category_products: [], total_products: 0 };
            })
        );

        const detailsResponses = await Promise.all(detailsPromises);
        
        // Step 3: Filter to categories with hero_carousels, sort by slides desc then total_products desc, select top 5
        const filteredWithSlides = detailsResponses.filter(cat => (cat.hero_carousels || []).length > 0);
        const sortedBySlidesAndPopularity = [...filteredWithSlides].sort((a, b) => {
          const aSlides = a.hero_carousels.length || 0;
          const bSlides = b.hero_carousels.length || 0;
          if (bSlides !== aSlides) return bSlides - aSlides;
          return (b.total_products ?? 0) - (a.total_products ?? 0);
        });
        const selectedCategories = sortedBySlidesAndPopularity.slice(0, 5);
        console.log("Filtered & Selected top categories (with slides):", selectedCategories.map(c => ({ slug: c.slug, hero_carousels_length: c.hero_carousels.length, total_products: c.total_products })));
        
        setCategoryDetails(selectedCategories);
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

  const numCats = categoryDetails.length;

  // Assign to 5 sections (pad with empty if fewer than 5)
  const getSectionData = (index) => categoryDetails[index] || { hero_carousels: [], slug: '' };
  const getCategorySlug = (index) => getSectionData(index).slug || '';

  // Navigation handler for carousel clicks/buttons (override to category page)
  const handleCarouselClick = (categorySlug) => {
    if (categorySlug) {
      navigate(`/category/${categorySlug}`);
    }
  };

  console.log("Section carousel lengths:", {
    leftLarge: getSectionData(0).hero_carousels.length,
    rightTop: getSectionData(1).hero_carousels.length,
    rightBottom: getSectionData(2).hero_carousels.length,
    leftBottom: getSectionData(3).hero_carousels.length,
    rightBottomNew: getSectionData(4).hero_carousels.length
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
        {/* Left large - render if at least 1 category with slides */}
        {numCats >= 1 && getSectionData(0).hero_carousels.length > 0 && (
          <div className="w-full lg:w-2/3 aspect-video lg:aspect-auto lg:h-[500px] overflow-hidden flex-shrink-0 relative">
            <ReusableCarousel
              data={getSectionData(0).hero_carousels}
              slidesPerView={1}
              speed={500}
              autoplayDelay={getSectionData(0).hero_carousels.length > 1 ? 4000 : 0}
              width="100%"
              height="100%"
              onSlideClick={(slide) => handleCarouselClick(getCategorySlug(0))} // 👈 Accept slide param for consistency
            />
          </div>
        )}

        {/* Right column: conditional based on numCats - side-by-side on mobile, stacked on lg */}
        {numCats >= 2 && (
          <div className={`w-full lg:w-1/3 overflow-hidden ${numCats >= 3 ? 'flex flex-row lg:flex-col gap-2 lg:gap-4' : ''}`}>
            {/* Right top - render if at least 2 categories with slides for index 1 */}
            {numCats >= 2 && getSectionData(1).hero_carousels.length > 0 && (
              <div className={`flex-1 min-w-0 aspect-video lg:aspect-auto overflow-hidden relative ${numCats === 2 ? 'lg:h-[500px]' : 'lg:h-[240px]'}`}>
                <ReusableCarousel
                  data={getSectionData(1).hero_carousels}
                  slidesPerView={1}
                  speed={500}
                  autoplayDelay={getSectionData(1).hero_carousels.length > 1 ? 4000 : 0}
                  width="100%"
                  height="100%"
                  onSlideClick={(slide) => handleCarouselClick(getCategorySlug(1))}
                />
              </div>
            )}

            {/* Right bottom - only if at least 3 categories with slides for index 2 */}
            {numCats >= 3 && getSectionData(2).hero_carousels.length > 0 && (
              <div className="flex-1 min-w-0 aspect-video lg:aspect-auto lg:h-[240px] overflow-hidden relative">
                <ReusableCarousel
                  data={getSectionData(2).hero_carousels}
                  slidesPerView={1}
                  speed={300}
                  autoplayDelay={getSectionData(2).hero_carousels.length > 1 ? 4000 : 0}
                  width="100%"
                  height="100%"
                  onSlideClick={(slide) => handleCarouselClick(getCategorySlug(2))}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ProductHighlights */}
      <div className="overflow-hidden">
        <ProductHighlights />
      </div>

      {/* PopularCategory */}
      <div className="overflow-hidden">
        <PopularCategory />
      </div>

      {/* Bottom side-by-side carousels - conditional based on numCats */}
      {numCats >= 4 && (
        <div className={`overflow-hidden ${numCats >= 5 ? 'flex flex-row gap-2 p-4 md:p-8' : 'p-4 md:p-8 flex justify-center'}`}>
          {/* Left bottom - render if >=4 and index 3 has slides */}
          {getSectionData(3).hero_carousels.length > 0 && (
            <div className={`${numCats >= 5 ? 'flex-1' : 'w-full'} min-w-0 aspect-video overflow-hidden relative`}>
              <ReusableCarousel
                data={getSectionData(3).hero_carousels}
                slidesPerView={1}
                speed={500}
                autoplayDelay={getSectionData(3).hero_carousels.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
                onSlideClick={(slide) => handleCarouselClick(getCategorySlug(3))}
              />
            </div>
          )}

          {/* Right bottom - render if >=5 and index 4 has slides */}
          {numCats >= 5 && getSectionData(4).hero_carousels.length > 0 && (
            <div className="flex-1 min-w-0 aspect-video overflow-hidden relative">
              <ReusableCarousel
                data={getSectionData(4).hero_carousels}
                slidesPerView={1}
                speed={500}
                autoplayDelay={getSectionData(4).hero_carousels.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
                onSlideClick={(slide) => handleCarouselClick(getCategorySlug(4))}
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />
      <MobileBottomNavbar />
    </div>
  );
}

export default Home;