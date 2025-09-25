// Ensures consistent image handling
export const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg"; // fallback
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${path}`;
};
