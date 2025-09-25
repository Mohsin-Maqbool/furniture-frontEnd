import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Get the latest deals & design tips in your inbox
        </h3>
        <form className="flex justify-center flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-gray-800 flex-1"
          />
          <button className="bg-amber-600 px-6 py-3 rounded-lg hover:bg-amber-700 transition">
            Subscribe
          </button>
        </form>
      </div>

      {/* Footer Links and Info */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-amber-500">Shop</a></li>
            <li><a href="#" className="hover:text-amber-500">Interiors</a></li>
            <li><a href="#" className="hover:text-amber-500">About</a></li>
            <li><a href="#" className="hover:text-amber-500">Policies</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold mb-4">Contact Info</h4>
          <ul className="space-y-2">
            <li>Phone: +92 300 1234567</li>
            <li>Email: info@hamzafurnitures.com</li>
            <li>Address: 123 Furniture Street, Karachi, Pakistan</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-amber-500"><FaInstagram /></a>
            <a href="#" className="hover:text-amber-500"><FaTwitter /></a>
            <a href="#" className="hover:text-amber-500"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Optional About */}
        <div>
          <h4 className="font-bold mb-4">About Hamza Furnitures</h4>
          <p className="text-gray-400">
            Premium furniture and interior solutions that transform your space. Affordable, stylish, and high-quality.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400">
        © {new Date().getFullYear()} Hamza Furnitures. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
