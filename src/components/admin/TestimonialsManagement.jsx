import React, { useEffect, useState } from "react";
import API from "@/utils/api";
import { toast } from "react-hot-toast";

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", feedback: "", rating: 5 });
  const [imageFile, setImageFile] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const { data } = await API.get("/testimonials");
      setTestimonials(data);
    } catch {
      toast.error("Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("feedback", form.feedback);
      formData.append("rating", form.rating);
      if (imageFile) formData.append("image", imageFile); // must be "image"

      await API.post("/testimonials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Testimonial added");
      setForm({ name: "", feedback: "", rating: 5 });
      setImageFile(null);
      fetchTestimonials();
    } catch (err) {
      console.error("❌ Add testimonial failed:", err);
      toast.error("Failed to add testimonial");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/testimonials/${id}`);
      toast.success("🗑️ Deleted");
      fetchTestimonials();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Testimonials</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Customer Name"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="feedback"
          value={form.feedback}
          onChange={handleChange}
          placeholder="Customer Feedback"
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          min="1"
          max="5"
          className="border p-2 w-full"
          required
        />
        <input type="file" onChange={handleFileChange} className="border p-2 w-full" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* List */}
      <ul>
        {testimonials.map((t) => (
          <li
            key={t._id}
            className="border p-3 mb-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {t.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${t.image}`}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <strong>{t.name}</strong> ({t.rating}⭐)
                <br />
                {t.feedback}
              </div>
            </div>
            <button
              onClick={() => handleDelete(t._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestimonialsManagement;
