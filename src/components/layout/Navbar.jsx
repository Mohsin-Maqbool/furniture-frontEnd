import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import { fetchCartCount } from "@/utils/cartApi";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [count, setCount] = useState(0); // Live cart count
  const loginRef = useRef();
  const signupRef = useRef();
  const location = useLocation();


  useEffect(() => {
  const onUnauth = () => {
    // ❌ ye hatao
    // window.location.href = "/login";

    // ✅ ye use karo
    setShowLogin(true);  // modal khol do
  };

  window.addEventListener("unauthorized", onUnauth);
  return () => window.removeEventListener("unauthorized", onUnauth);
}, []);



  // ✅ Load cart count initially
  useEffect(() => {
    const loadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCount(0);
          return;
        }
        const c = await fetchCartCount();
        setCount(c);
      } catch (err) {
        console.error("Cart count load error:", err);
        setCount(0);
      }
    };
    loadCount();

    // react to global unauthorized events (from API interceptor)
    const onUnauth = () => {
      setCount(0);
    };
    window.addEventListener("unauthorized", onUnauth);
    return () => window.removeEventListener("unauthorized", onUnauth);
  }, []);


  // ✅ Listen for cart updates globally
  useEffect(() => {
    const handleCartUpdate = (e) => setCount(e.detail.count);
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // ✅ Close modals on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showLogin && loginRef.current && !loginRef.current.contains(e.target)) {
        setShowLogin(false);
      }
      if (showSignup && signupRef.current && !signupRef.current.contains(e.target)) {
        setShowSignup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLogin, showSignup]);

  // ✅ Scroll to homepage sections
  const goToSection = (id) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Hamza Furnitures
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <span onClick={() => goToSection("hero")} className="cursor-pointer hover:text-indigo-600">Home</span>
          <span onClick={() => goToSection("shop")} className="cursor-pointer hover:text-indigo-600">Shop</span>
          <span onClick={() => goToSection("bestsellers")} className="cursor-pointer hover:text-indigo-600">Best Sellers</span>
          <span onClick={() => goToSection("interiors")} className="cursor-pointer hover:text-indigo-600">Interiors</span>
          <span onClick={() => goToSection("whychooseus")} className="cursor-pointer hover:text-indigo-600">Why Us</span>
          <span onClick={() => goToSection("testimonials")} className="cursor-pointer hover:text-indigo-600">Testimonials</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLogin(true)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignup(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Signup
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={loginRef} className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <Login
              onClose={() => setShowLogin(false)}
              onSwitchToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={signupRef} className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <Signup
              onClose={() => setShowSignup(false)}
              onSwitchToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
