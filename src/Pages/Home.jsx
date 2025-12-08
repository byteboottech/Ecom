// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Axios from "../Axios/Axios";
import NavBar from "../components/user/NavBar/NavBar";
import Footer from "../components/user/Footer/Footer";
import ReusableCarousel from '../components/user/Carousel/ReusableCarousel';
import ProductHighlights from '../components/user/Products/ProductHighlights';
import PopularCategory from '../components/user/Category/PopularCategory';
import MobileBottomNavbar from '../components/user/NavBar/MobileBottomNavbar';

function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to split array into n chunks as evenly as possible
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
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await Axios.get('/advertisement/product/hero-carousels/');
        console.log("API Response:", response.data);
        setCarouselData(response.data || []);
      } catch (err) {
        console.error('Error fetching carousel data:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  // confirm state update
  useEffect(() => {
    console.log("Updated carouselData:", carouselData);
  }, [carouselData]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading carousels...</div>
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

  if (!carouselData || carouselData.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        <div className="text-lg">No carousel data available.</div>
      </div>
    );
  }

  // Sort by order (if present)
  const sortedData = [...carouselData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Split into 5 unique groups for all carousels (non-overlapping, evenly distributed)
  const totalCarousels = 5;
  const groups = chunkArray(sortedData, totalCarousels);

  console.log("Carousel groups (5):", groups.map(g => g.length));

  const leftLargeData = groups[0] || [];
  const rightTopData = groups[1] || [];
  const rightBottomData = groups[2] || [];
  const leftBottomData = groups[3] || [];
  const rightBottomDataNew = groups[4] || [];

  return (
    <div>
      <NavBar />

      {/* Top area: left large (2/3) and right column with two stacked carousels (1/3) */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 md:p-8 overflow-hidden"> {/* overflow-hidden on row to clip any child overflow */}
        {/* Left large */}
        {leftLargeData.length > 0 && (
          <div className="w-full lg:w-2/3 aspect-video lg:aspect-auto lg:h-[500px] overflow-hidden flex-shrink-0 relative"> {/* flex-shrink-0 to prevent squeeze; overflow-hidden; relative for absolute children clipping; lg:aspect-auto to avoid aspect ratio padding conflict with fixed height */}
            <ReusableCarousel
              data={leftLargeData}
              slidesPerView={1}
              speed={500}
              autoplayDelay={leftLargeData.length > 1 ? 4000 : 0}
              width="100%"
              height="100%"
            />
          </div>
        )}

        {/* Right column: two carousels — ORIGINAL LAYOUT RESTORED: side-by-side on mobile (row), stacked on lg; FIXED: flex-wrap + full width on xs to avoid overflow */}
        <div className="w-full flex flex-row lg:flex-col gap-2 lg:gap-4 lg:w-1/3 overflow-hidden"> {/* flex-row on mobile for side-by-side; flex-wrap below; reduced gap on mobile */}
          {rightTopData.length > 0 && (
            <div className="flex-1 min-w-0 aspect-video lg:aspect-auto lg:h-[240px] overflow-hidden relative"> {/* flex-1 for equal split; min-w-0 prevents flex overflow; flex-wrap via parent; relative for absolute children clipping; lg:aspect-auto to avoid aspect ratio padding conflict with fixed height */}
              <ReusableCarousel
                data={rightTopData}
                slidesPerView={1}
                speed={500}
                autoplayDelay={rightTopData.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
              />
            </div>
          )}

          {rightBottomData.length > 0 && (
            <div className="flex-1 min-w-0 aspect-video lg:aspect-auto lg:h-[240px] overflow-hidden relative"> {/* Same fixes for bottom; relative for absolute children clipping; lg:aspect-auto to avoid aspect ratio padding conflict with fixed height */}
              <ReusableCarousel
                data={rightBottomData}
                slidesPerView={1}
                speed={300}
                autoplayDelay={rightBottomData.length > 1 ? 4000 : 0}
                width="100%"
                height="100%"
              />
            </div>
          )}
        </div>
      </div>

      {/* ProductHighlights — WRAP: Clip any internal overflow (e.g., buttons in Best Sellers) */}
      <div className="overflow-hidden">
        <ProductHighlights />
      </div>

      {/* PopularCategory — WRAP: Same for category section */}
      <div className="overflow-hidden">
        <PopularCategory />
      </div>

      {/* Bottom side-by-side carousels: flex-row for side-by-side layout on all screens including mobile */}
   <div className="flex flex-row gap-2 p-4 md:p-8 overflow-hidden">
  <div className="flex-1 min-w-0 aspect-video overflow-hidden relative">
    {leftBottomData.length > 0 && (
      <ReusableCarousel
        data={leftBottomData}
        slidesPerView={1}
        speed={500}
        autoplayDelay={leftBottomData.length > 1 ? 4000 : 0}
        width="100%"
        height="100%"
      />
    )}
  </div>

  <div className="flex-1 min-w-0 aspect-video overflow-hidden relative">
    {rightBottomDataNew.length > 0 && (
      <ReusableCarousel
        data={rightBottomDataNew}
        slidesPerView={1}
        speed={500}
        autoplayDelay={rightBottomDataNew.length > 1 ? 4000 : 0}
        width="100%"
        height="100%"
      />
    )}
  </div>
</div>


      {/* Footer */}
      <Footer />
      <MobileBottomNavbar/>
    </div>
  );
}

export default Home;