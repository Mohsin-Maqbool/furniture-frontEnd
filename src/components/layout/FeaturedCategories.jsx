import React from "react";
import { Link } from "react-router-dom"; // for navigation

const categories = [
  {
    name: "Sofas & Couches",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    link: "/shop/sofas",
  },
  {
    name: "Beds & Wardrobes",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    link: "/shop/beds",
  },
  {
    name: "Dining Sets",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    link: "/shop/dining",
  },
  {
    name: "Office Furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    link: "/shop/office",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Featured Categories
        </h2>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={cat.link}
              className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-lg font-semibold drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
