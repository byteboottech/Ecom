// components/user/ReusableCarousel/ReusableCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules'; // Removed Pagination module
import 'swiper/css';
import 'swiper/css/navigation'; // Removed pagination CSS

// Define the shape of each slide data item
interface SlideData {
  id: number;
  image: string;
  alt_text: string;
  head_one: string;
  head_two: string;
  description: string;
  button_text: string;
  button_link: string;
  order: number;
}

interface ReusableCarouselProps {
  data: SlideData[];
  slidesPerView?: number;
  speed?: number;
  autoplayDelay?: number;
  width?: string;
  height?: string;
  fitMode?: 'cover' | 'contain' | 'fill';
  onSlideClick?: (slide: SlideData) => void; // 👈 Optional onClick handler for slides (e.g., for navigation or analytics)
}

const ReusableCarousel: React.FC<ReusableCarouselProps> = ({
  data,
  slidesPerView = 1,
  speed = 300,
  autoplayDelay = 3000,
  width = '100%',
  height = '400px',
  fitMode = 'cover',
  onSlideClick,
}) => {

  const sortedData = [...data].sort((a, b) => a.order - b.order);

  // 🚀 FIX 1 — Prevent flexbox from shrinking the whole carousel
  const wrapperStyle: React.CSSProperties = {
    width,
    height,
    flexShrink: 0, // 👈 Prevent collapse in parent flex layout
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: fitMode,
    objectPosition: 'center',
  };

  const slideStyle: React.CSSProperties = {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    // borderRadius: '8px', // 👈 Already removed for square edges (slides)
  };

  // 👈 Handle slide click (e.g., navigate to button_link or custom logic)
  const handleSlideClick = (slide: SlideData, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation(); // 👈 Prevent Swiper from interfering
    }
    if (onSlideClick) {
      onSlideClick(slide);
    } else {
      // Default: Navigate to button_link (use '_self' for same tab if preferred)
      window.location.href = slide.button_link; // 👈 Changed to direct navigation for reliability (avoids pop-up blockers)
    }
  };

  return (
    <div className="w-full" style={wrapperStyle}>
      <Swiper
        modules={[Autoplay, Navigation]} // Removed Pagination
        spaceBetween={30}
        slidesPerView={slidesPerView}
        speed={speed}
        autoplay={
          autoplayDelay > 0
            ? { delay: autoplayDelay, disableOnInteraction: false }
            : false
        }
        // Removed pagination={{ clickable: true }}
        navigation={slidesPerView > 1}
        // 👈 KEY FIX: Allow clicks inside slides without preventing them (default is true, which blocks child clicks)
        preventClicks={false}
        preventClicksPropagation={false}
        
        // 🚀 FIX 2 — Guarantee Swiper always occupies full height
        className="h-full"
        style={{ height: '100%', minHeight: height }}
      >
        {sortedData.map((slide) => (
          <SwiperSlide key={slide.id} style={slideStyle}>
            <img
              src={slide.image}
              alt={slide.alt_text}
              style={imageStyle}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/path/to/fallback-image.jpg';
              }}
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

            {/* 👈 Clickable overlay: Full slide on all devices, z-15 below button (z-20) on desktop; pointer cursor for feedback */}
            <div
              className="absolute inset-0 z-[15] cursor-pointer select-none" // 👈 Full clickable area with pointer on all devices
              onClick={(e) => handleSlideClick(slide, e)}
            />

            {/* 👈 Button: Hidden on mobile/tablet (under md), shown on desktop (md+); clickable via <a> */}
            <div className="hidden md:block absolute bottom-0 right-0 z-20 p-2 sm:p-4 md:p-6"> {/* 👈 hidden md:block: Show only on desktop */}
              <a
                href={slide.button_link}
                onClick={(e) => handleSlideClick(slide, e)} // 👈 Consistent handler for button too
                className="
                  inline-block 
                  bg-red-500 hover:bg-red-600 
                  text-white font-bold 
                  py-1 px-2 text-xs        
                  sm:py-2 sm:px-4 sm:text-sm 
                  md:py-3 md:px-6 md:text-base 
                  transition-all duration-300
                  shadow-md hover:shadow-lg
                "
              >
                {slide.button_text}
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReusableCarousel;