const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// ✅ Enable CORS for all origins
app.use(cors({ origin: "*", methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

// ✅ Dialog SMS API Details
const DIALOG_URL = "https://e-sms.dialog.lk/api/v1/message-via-url/create/url-campaign";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ2MDksImN1c3RvbWVyX3JvbGUiOjAsImlhdCI6MTc0MDAyOTUxOSwiZXhwIjo0ODY0MjMxOTE5fQ.D6FMPID6GBuy_P8noSlIAFUexjkTbufFGn_nN4TdfI";
const SOURCE = "MATRIX INFO";

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Render SMS Proxy is running successfully!");
});

// ✅ SMS Sending Endpoint
app.post("/send-sms", async (req, res) => {
  try {
    const { mobile, message } = req.body;
    if (!mobile || !message) {
      return res.status(400).send({ status: "ERROR", error: "Missing mobile or message" });
    }

    const url = `${DIALOG_URL}?esmsqk=${TOKEN}&list=${encodeURIComponent(
      mobile
    )}&source_address=${encodeURIComponent(SOURCE)}&message=${encodeURIComponent(message)}`;

    console.log("➡️ Sending SMS request to Dialog:", url);

    const response = await fetch(url);
    const text = await response.text();

    console.log("✅ Dialog API Response:", text);
    res.send({ status: "OK", gatewayResponse: text });
  } catch (err) {
    console.error("❌ SMS API Error:", err);
    res.status(500).send({ status: "ERROR", error: err.message });
  }
});

// ✅ Use Render Port or Local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SMS Proxy running on port ${PORT}`));
