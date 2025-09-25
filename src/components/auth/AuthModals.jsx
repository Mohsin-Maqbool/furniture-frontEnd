import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {/* Buttons to open */}
      <button
        onClick={() => {
          setShowLogin(true);
          setShowSignup(false);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Open Login
      </button>

      <button
        onClick={() => {
          setShowSignup(true);
          setShowLogin(false);
        }}
        className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Open Signup
      </button>

      {/* Modals */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitch={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
