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
}

const ReusableCarousel: React.FC<ReusableCarouselProps> = ({
  data,
  slidesPerView = 1,
  speed = 300,
  autoplayDelay = 3000,
  width = '100%',
  height = '400px',
  fitMode = 'cover',
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

            <div className="absolute bottom-0 right-0 z-20 p-2 sm:p-4 md:p-6"> {/* 👈 Reduced padding on mobile for tighter button placement */}
              <a
                href={slide.button_link}
                className="
                  inline-block 
                  bg-red-500 hover:bg-red-600 
                  text-white font-bold 
                  py-1 px-2 text-xs        /* Mobile: even smaller padding and text */
                  sm:py-2 sm:px-4 sm:text-sm /* Tablet: medium */
                  md:py-3 md:px-6 md:text-base /* Desktop: large */
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