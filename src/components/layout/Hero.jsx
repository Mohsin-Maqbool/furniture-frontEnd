import React from "react";
import { Link } from "react-router-dom";


const HeroSection = () => {
  return (
    <section
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Comfort Meets Elegance in Every Corner
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-lg md:text-xl text-gray-200">
          Premium furniture crafted for your home & office
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/shop">
            <button className="px-6 py-3 bg-amber-600 text-white rounded-xl shadow-lg hover:bg-amber-700 transition">
              Shop Now
            </button>
          </Link>
          <Link to="/interiors">
            <button className="px-6 py-3 bg-white text-gray-900 rounded-xl shadow-lg hover:bg-gray-200 transition">
              Explore Interiors
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
