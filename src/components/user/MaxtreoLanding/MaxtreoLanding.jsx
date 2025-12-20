import React from 'react';
import { Printer, Zap, Shield, TrendingUp, Package, CheckCircle, Star, ChevronRight } from 'lucide-react';
import Epson from "../../../Images/epson-logo.png"
import hp from "../../../Images/hp-logo.png"
import { useNavigate } from 'react-router-dom';


export default function MaxtreoLanding() {
    const navigate = useNavigate();
  const categories = [
    { name: 'Printer Cartridges', count: '1,200', icon: Printer },
    { name: 'Toner Supplies', count: '850', icon: Package },
    { name: 'Ink Solutions', count: '950', icon: Package },
    { name: 'Large Format', count: '320', icon: Printer },
    { name: 'Enterprise Solutions', count: '480', icon: TrendingUp },
    { name: 'Specialty Items', count: '410', icon: Star },
  ];

  const features = [
    { icon: Zap, title: 'Instant Digital Delivery', desc: 'Immediate fulfillment with rapid processing and instant availability confirmation.' },
    { icon: Shield, title: '24/7 Expert Support', desc: 'Dedicated technical assistance for institutional clients with complex requirements.' },
    { icon: TrendingUp, title: 'Volume Discounts', desc: 'Competitive pricing with flexible volume-based discounts for enterprises.' },
    { icon: Package, title: 'License Management', desc: 'Comprehensive tracking to simplify institutional compliance and inventory.' },
  ];

  const stats = [
    { number: '12+', label: 'Years Serving Institutions' },
    { number: '500+', label: 'Enterprise Clients' },
    { number: '99.9%', label: 'Service Uptime' },
    { number: '<2hrs', label: 'Average Response Time' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-12 overflow-hidden">
        {/* Yellow accent elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-black text-yellow-400 px-4 py-2 rounded-full text-base font-semibold mb-4 border-2 border-yellow-400">
              <CheckCircle size={16} className="mr-2" />
              Authorized HP & Epson Channel Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Premium Digital Consumables
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                for Enterprises & Institutions
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700 max-w-3xl mx-auto">
              Authorized supplier delivering instant availability, trusted partnerships,
              and expert support for your digital needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button onClick={() => navigate('/products')}
               className="bg-black text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition flex items-center group border-2 border-yellow-400">
                Browse Products 
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-base font-semibold text-gray-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                5,000 SKUs Available
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                Instant Delivery
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-8 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 group-hover:scale-110 transition">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
            <section className="py-8 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-black">
      Trusted by <span className="text-yellow-500">500+</span> Institutions & Enterprises
    </h2>
    <p className="text-center text-gray-600 mb-6">Authorized partnerships and proven reliability</p>
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition text-center group">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
          <CheckCircle size={32} className="text-black" />
        </div>
        <h3 className="font-bold text-base mb-1">Authorized Supplier</h3>
        <p className="text-gray-600 text-base">Certified partner with verified credentials</p>
      </div>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition text-center group">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
          <img 
            src={hp} 
            alt="HP Logo" 
            className="w-12 h-12 object-contain" 
          />
        </div>
        <h3 className="font-bold text-base mb-1">HP Channel Partner</h3>
        <p className="text-gray-600 text-base">Official HP partner with genuine products</p>
      </div>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition text-center group">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
          <img 
            src={Epson} 
            alt="Epson Logo" 
            className="w-12 h-12 object-contain" 
          />
        </div>
        <h3 className="font-bold text-base mb-1">Epson Channel Partner</h3>
        <p className="text-gray-600 text-base">Certified Epson partner with expertise</p>
      </div>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition text-center group">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
          <TrendingUp size={32} className="text-black" />
        </div>
        <h3 className="font-bold text-base mb-1">Enterprise Grade</h3>
        <p className="text-gray-600 text-base">Professional-grade solutions</p>
      </div>
    </div>
  </div>
</section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-black">Featured Categories</h2>
          <p className="text-center text-gray-600 mb-6">Browse our complete range of digital consumables</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-yellow-400 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-400 transition">
                    <category.icon size={20} className="text-yellow-400 group-hover:text-black transition" />
                  </div>
                  <h3 className="text-base font-bold text-black mb-1">{category.name}</h3>
                  <p className="text-gray-600 font-semibold text-base mb-1">{category.count} products</p>
                  <div className="inline-flex items-center text-base">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                    <span className="text-gray-700 font-medium">In Stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-black">Why Choose Maxtreo</h2>
          <p className="text-center text-gray-600 mb-6">Professional service excellence that sets us apart</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-2 group-hover:bg-yellow-400 transition">
                  <feature.icon size={24} className="text-yellow-400 group-hover:text-black transition" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}