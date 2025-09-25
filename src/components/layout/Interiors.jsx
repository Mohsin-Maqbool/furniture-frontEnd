import React from "react";

const interiors = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGludGVyaW9yfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGludGVyaW9yfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGludGVyaW9yfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D",
];

const Interiors = () => {
  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Transform Your Space
        </h2>
        <p className="text-gray-600 mb-10">
          Get inspired with our curated interior designs and stylish furniture arrangements.
        </p>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {interiors.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl shadow-lg group"
            >
              <img
                src={img}
                alt={`Interior ${index + 1}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <button className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition">
            Book a Free Interior Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default Interiors;
