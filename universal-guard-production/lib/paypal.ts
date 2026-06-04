type PayPalTokenResponse = {
  access_token: string;
};

function baseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  const res = await fetch(baseUrl() + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!res.ok) {
    throw new Error("Could not get PayPal access token");
  }

  const data = (await res.json()) as PayPalTokenResponse;
  return data.access_token;
}

export async function createPayPalOrder() {
  const token = await getPayPalAccessToken();
  const price = process.env.LICENSE_PRICE_USD || "49.00";

  const res = await fetch(baseUrl() + "/v2/checkout/orders", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price
          },
          description: "Universal Guard License"
        }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("PayPal order creation failed: " + text);
  }

  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();

  const res = await fetch(baseUrl() + "/v2/checkout/orders/" + orderId + "/capture", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("PayPal capture failed: " + text);
  }

  return res.json();
}
