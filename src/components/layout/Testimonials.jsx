import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import { toast } from "react-hot-toast";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await API.get("/testimonials");
        setTestimonials(data);
      } catch (err) {
        console.error("❌ Failed to fetch testimonials:", err);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) return <div className="p-6 text-center">⏳ Loading testimonials...</div>;
  if (!testimonials.length)
    return <div className="p-6 text-center text-gray-500">No testimonials yet.</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          What Our Customers Say
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {t.image && (
                <img
                  src={`http://localhost:4500/uploads/${t.image}`}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <p className="text-gray-600 mb-4">"{t.feedback}"</p>
              <div className="flex justify-center mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-500">&#9733;</span>
                ))}
                {Array.from({ length: 5 - t.rating }).map((_, i) => (
                  <span key={i} className="text-gray-300">&#9733;</span>
                ))}
              </div>
              <h4 className="text-gray-800 font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
