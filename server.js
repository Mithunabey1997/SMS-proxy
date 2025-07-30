const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DIALOG_URL = "https://e-sms.dialog.lk/api/v1/message-via-url/create/url-campaign";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQ2MDksImN1c3RvbWVyX3JvbGUiOjAsImlhdCI6MTc0MDAyOTUxOSwiZXhwIjo0ODY0MjMxOTE5fQ.D6FMPID6GBuy_P8noSlIAFUexjkTbufFGn_nN4TdfI";
const SOURCE = "MATRIX INFO";

app.post("/send-sms", async (req, res) => {
  try {
    const { mobile, message } = req.body;
    const url = `${DIALOG_URL}?esmsqk=${TOKEN}&list=${encodeURIComponent(
      mobile
    )}&source_address=${encodeURIComponent(SOURCE)}&message=${encodeURIComponent(message)}`;

    const response = await fetch(url);
    const text = await response.text();

    res.send({ status: "OK", gatewayResponse: text });
  } catch (err) {
    res.status(500).send({ status: "ERROR", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SMS Proxy running on port ${PORT}`));
