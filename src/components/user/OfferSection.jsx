import React, { useState, useEffect } from 'react';
import { Zap, Tag, TrendingUp, Sparkles, Clock, Gift } from 'lucide-react';

const OffersSection = () => {
  // Enhanced slideshow banners with vibrant designs
  const slideshowBanners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
      title: 'iPhone Mega Sale',
      subtitle: 'Save up to 50% on latest models',
      badge: 'HOT DEAL',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      icon: Zap,
      accentColor: 'bg-yellow-400',
      timer: '2d 14h left'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      title: 'Laptop Flash Sale',
      subtitle: 'Premium laptops starting at $499',
      badge: 'LIMITED TIME',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      icon: TrendingUp,
      accentColor: 'bg-orange-400',
      timer: '5h 23m left'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      title: 'Audio Gear Bonanza',
      subtitle: 'Wireless headphones at 40% off',
      badge: 'EXCLUSIVE',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      icon: Sparkles,
      accentColor: 'bg-green-400',
      timer: '1d 8h left'
    }
  ];

  const carouselProducts = [
    {
      id: 1,
      name: 'Apple iPhone 15',
      originalPrice: '$999',
      offerPrice: '$799',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400'
    },
    {
      id: 2,
      name: 'Dell XPS 13 Laptop',
      originalPrice: '$1,299',
      offerPrice: '$999',
      discount: '23% OFF',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      originalPrice: '$399',
      offerPrice: '$299',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    {
      id: 4,
      name: 'Samsung Galaxy Watch',
      originalPrice: '$349',
      offerPrice: '$249',
      discount: '29% OFF',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'
    },
    {
      id: 5,
      name: 'MacBook Air M2',
      originalPrice: '$1,199',
      offerPrice: '$999',
      discount: '17% OFF',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = slideshowBanners[currentSlide];
  const Icon = currentBanner.icon;

  return (
    <div className="flex h-96 w-full bg-gradient-to-br from-gray-50 to-gray-100  overflow-hidden shadow-2xl mx-auto my-5">
      {/* Left Half: Enhanced Slideshow */}
      <div className="w-1/2 relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slideshowBanners.map((banner) => {
            const BannerIcon = banner.icon;
            return (
              <div
                key={banner.id}
                className="min-w-full h-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
                style={{
                  backgroundImage: `url(${banner.image})`,
                }}
              >
                {/* Multi-layer gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} opacity-80`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-8 max-w-2xl text-center">
                  {/* Badge with icon */}
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/30">
                    <BannerIcon className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">{banner.badge}</span>
                  </div>

                  {/* Main icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${banner.accentColor} rounded-full mb-4 shadow-lg`}>
                    <Tag className="w-8 h-8 text-gray-900" />
                  </div>

                  {/* Title and subtitle */}
                  <h2 className="text-5xl font-black text-center mb-3 drop-shadow-2xl tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-2xl text-center drop-shadow-lg font-medium mb-4 opacity-95">
                    {banner.subtitle}
                  </p>

                  {/* Timer */}
                  <div className="inline-flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg shadow-lg">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-lg">{banner.timer}</span>
                  </div>

                  {/* CTA Button */}
                  <button className="mt-6 bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform hover:shadow-2xl">
                    Shop Now
                  </button>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg font-black text-sm rotate-3 shadow-lg">
                  <Gift className="w-4 h-4 inline mr-1" />
                  FREE SHIPPING
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slideshowBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8 shadow-lg' 
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Half: Carousel */}
      <div className="w-1/2 p-6 flex flex-col bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Top Offers</h3>
          <span className="text-sm text-red-600 font-semibold animate-pulse">● LIVE NOW</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory scrollbar-hide">
          {carouselProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[170px] snap-start bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-3 text-center shadow-md hover:shadow-xl transition-all hover:scale-105 hover:border-purple-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                  {product.discount}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
              <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-xl font-black text-red-600">{product.offerPrice}</span>
                <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
              </div>
              <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersSection;