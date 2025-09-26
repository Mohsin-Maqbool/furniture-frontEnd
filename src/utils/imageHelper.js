// client/src/utils/imageHelper.js
export const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg"; // fallback
  if (path.startsWith("http")) return path; // Cloudinary or any hosted file
  
  // Local dev fallback (when still using /uploads/)
  return `${import.meta.env.VITE_API_URL || "http://localhost:4500"}/${path}`;
};
