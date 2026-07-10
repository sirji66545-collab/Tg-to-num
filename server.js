const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Your API Key
const USER_API_KEY = "permanant";

// Backend API
const BACKEND_URL = "https://api.aerivue.dev/tg";

app.get("/api/tg", async (req, res) => {
  try {
    const { key, info } = req.query;

    // Check API Key
    if (!key) {
      return res.status(400).json({
        status: false,
        message: "Missing API Key"
      });
    }

    if (key !== USER_API_KEY) {
      return res.status(403).json({
        status: false,
        message: "Invalid API Key"
      });
    }

    // Check info
    if (!info) {
      return res.status(400).json({
        status: false,
        message: "Missing info parameter"
      });
    }

    // Forward request to Aerivue API
    const response = await axios.get(BACKEND_URL, {
      params: {
        query: info
      },
      timeout: 30000
    });

    let data = response.data;

    // Replace credits if response is string
    if (typeof data === "string") {
      data = data
        .replace(/By\s*@aerivue/gi, "By @sahilxalone")
        .replace(/@aerivue/gi, "@sahilxalone");

      return res.send(data);
    }

    // Replace credits in JSON
    const modified = JSON.parse(
      JSON.stringify(data)
        .replace(/By\s*@aerivue/gi, "By @sahilxalone")
        .replace(/@aerivue/gi, "@sahilxalone")
    );

    return res.json(modified);

  } catch (err) {
    console.error(err.message);

    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    status: true,
    owner: "@sahilxalone",
    endpoint: "/api/tg?key="
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
