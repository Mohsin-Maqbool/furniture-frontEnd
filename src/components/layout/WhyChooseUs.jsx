import React from "react";
import { FaCouch, FaDollarSign, FaPaintRoller, FaTruck } from "react-icons/fa";

const reasons = [
  {
    icon: <FaCouch className="text-4xl text-amber-600 mb-4" />,
    title: "Premium Quality Materials",
    description: "We use only the finest materials to craft furniture that lasts.",
  },
  {
    icon: <FaDollarSign className="text-4xl text-amber-600 mb-4" />,
    title: "Affordable Prices",
    description: "Luxury furniture that fits your budget without compromise.",
  },
  {
    icon: <FaPaintRoller className="text-4xl text-amber-600 mb-4" />,
    title: "Custom Interior Solutions",
    description: "Tailored furniture and designs to match your style.",
  },
  {
    icon: <FaTruck className="text-4xl text-amber-600 mb-4" />,
    title: "Fast Delivery & Support",
    description: "Quick shipping and responsive customer service.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Why Choose Us
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div>{reason.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
