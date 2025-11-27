import React from 'react';
import { Link } from 'react-router-dom';
import laptop from "../../../Images/Gemini_Generated_laptop.png";
import smartphone from "../../../Images/smartphone.png"
import printer from "../../../Images/Gemini_Generated_Image_printer.png";
import tablet from "../../../Images/Gemini_Generated_Image_tablet.png";

function PopularCategory() {
  const categories = [
    { id: 1, name: 'Laptop', image: laptop },
    { id: 2, name: 'Mobile', image: smartphone },
    { id: 3, name: 'Tabs', image: tablet },
    { id: 4, name: 'Printer', image: printer },
  ];

  return (
    <div className="py-5 lg:py-8 max-w-7xl mx-auto px-4 lg:px-0">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 font-[Rajdhani] mb-6 lg:mb-8 text-left">
        Popular Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/categoryproductlist?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
            className="category-link group flex flex-col items-center border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white"
          >
            <div className="w-full h-32 lg:h-48 flex items-center justify-center mb-3 lg:mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 text-center">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularCategory;