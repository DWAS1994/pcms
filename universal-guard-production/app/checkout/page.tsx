"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="panel p-8 w-full max-w-xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Buy Universal Guard License</h1>
          <p className="text-slate-400">Secure PayPal checkout and instant license generation.</p>
        </div>

        {error && <div className="text-red-300">{error}</div>}

        {licenseKey ? (
          <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-5">
            <p className="text-green-200 font-semibold">Payment complete. Your license key:</p>
            <p className="font-mono mt-3 break-all text-lg">{licenseKey}</p>
          </div>
        ) : (
          <>
            <input
              className="input"
              placeholder="Customer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PayPalScriptProvider options={{ clientId, currency: "USD", intent: "capture" }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  setError("");
                  if (!email) {
                    setError("Email is required");
                    throw new Error("Email required");
                  }

                  const res = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    throw new Error(data.error || "Could not create order");
                  }

                  return data.id;
                }}
                onApprove={async (data) => {
                  const res = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderId: data.orderID,
                      email
                    })
                  });

                  const json = await res.json();

                  if (!res.ok) {
                    setError(json.error || "Could not capture payment");
                    return;
                  }

                  setLicenseKey(json.license.licenseKey);
                }}
              />
            </PayPalScriptProvider>
          </>
        )}
      </div>
    </main>
  );
}
