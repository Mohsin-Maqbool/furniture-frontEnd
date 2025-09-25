import React, { useState } from "react";

export default function AddressForm({ onSelect }) {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = e => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSelect = () => {
    // validate required fields
    if (!address.name || !address.line1 || !address.city) {
      return alert("Please fill required fields");
    }
    onSelect(address);
  };

  return (
    <div className="p-4 border rounded mb-6">
      <h3 className="font-semibold mb-2">Shipping Address</h3>
      <input name="name" placeholder="Full Name" value={address.name} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="phone" placeholder="Phone" value={address.phone} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="line1" placeholder="Address Line" value={address.line1} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="zip" placeholder="ZIP" value={address.zip} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <button onClick={handleSelect} className="w-full py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600">Select Address</button>
    </div>
  );
}
