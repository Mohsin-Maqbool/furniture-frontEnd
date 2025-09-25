// client/src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import FeaturedCategories from "@/components/layout/FeaturedCategories";
import BestSellers from "./components/layout/BestSellers";
import Interiors from "@/components/layout/Interiors";
import WhyChooseUs from "@/components/layout/WhyChooseUs";
import Testimonials from "./components/layout/Testimonials";
import Footer from "@/components/layout/Footer";

// Admin
import AdminDashboard from "@/components/admin/AdminDashboard";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import OrdersManagement from "@/components/admin/OrdersManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";

// User Views
import Shop from "@/views/Shop";
import Cart from "@/views/Cart";
import Checkout from "@/views/Checkout";
import Orders from "@/views/Orders"; // 👈 new: order history page
import InteriorsPage from "./views/Interiors";

// Debug
import TestAPI from "./components/TestAPI";

export default function App() {
  const location = useLocation();

  // ✅ Hide Navbar + Footer for admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <section id="hero"><Hero /></section>
                <section id="shop"><FeaturedCategories /></section>
                <section id="bestsellers"><BestSellers /></section>
                <section id="interiors"><Interiors /></section>
                <section id="whychooseus"><WhyChooseUs /></section>
                <section id="testimonials"><Testimonials /></section>
              </>
            }
          />

          {/* Shop / Cart / Checkout / Orders */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} /> {/* user order history */}
          <Route path="/interiors" element={<InteriorsPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin/AdminDashboard/*" element={<AdminDashboard />}>
            <Route index element={<div>Select an option from sidebar</div>} />
            <Route path="CategoriesManagement" element={<CategoriesManagement />} />
            <Route path="ProductsManagement" element={<ProductsManagement />} />
            <Route path="OrdersManagement" element={<OrdersManagement />} />
            <Route path="UsersManagement" element={<UsersManagement />} />
            <Route path="TestimonialsManagement" element={<TestimonialsManagement />} />
          </Route>

          {/* Debug / Test */}
          <Route path="/test-api" element={<TestAPI />} />

          {/* 404 */}
          <Route path="*" element={<div className="p-6 text-center">❓ 404 Not Found</div>} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
