import React, { useRef, useEffect } from "react";
import Signup from "./Signup";

export default function SignupModal({ open, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>

      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

       <Signup onClose={onClose} onSwitch={onSwitch} />

      </div>
    </div>
  );
}
