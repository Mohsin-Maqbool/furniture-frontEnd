import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173/api", // backend ka server.js port
  withCredentials: true, // agar cookies use kar raha hai (auth ke liye)
});

export default api;
