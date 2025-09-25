import React from "react";

export default function PaymentMethod({ selected, onChange }) {
  return (
    <div className="p-4 border rounded mb-6">
      <h3 className="font-semibold mb-2">Payment Method</h3>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            value="COD"
            checked={selected === "COD"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>

        {/*
        <label>
          <input
            type="radio"
            value="Stripe"
            checked={selected === "Stripe"}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="ml-2">Pay Online (Stripe)</span>
        </label>
        */}
      </div>
    </div>
  );
}
