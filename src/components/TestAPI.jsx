import React, { useEffect } from "react";
import API from "../utils/api";

export default function TestAPI() {
  useEffect(() => {
    API.get("/orders")
      .then(res => console.log("✅ Orders:", res.data))
      .catch(err => console.error("❌ Error:", err.response?.data || err));
  }, []);

  return <div className="p-4">Check console for API response 🚀</div>;
}
