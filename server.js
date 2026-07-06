const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// User API Key
const USER_API_KEY = "permanant";

// Original Backend API Key
const BACKEND_API_KEY = "ftgamer";

// Original Backend URL
const BACKEND_URL =
  "http://broad-dust-ad2f.mohammadumar7221.workers.dev/api/tg";

app.get("/api/tg", async (req, res) => {
  try {
    const { key, info } = req.query;

    // Validate API Key
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

    if (!info) {
      return res.status(400).json({
        status: false,
        message: "Missing info parameter"
      });
    }

    // Call Original Backend
    const response = await axios.get(BACKEND_URL, {
      params: {
        key: BACKEND_API_KEY,
        info: info
      },
      responseType: "text"
    });

    let data = response.data;

    // Replace Credits
    if (typeof data === "string") {
      data = data
        .replace(/By\s*@draxionnn/gi, "@sahilxalone")
        .replace(/@draxionnn/gi, "@sahilxalone");
    } else {
      data = JSON.stringify(data)
        .replace(/By\s*@draxionnn/gi, "@sahilxalone")
        .replace(/@draxionnn/gi, "@sahilxalone");
    }

    res.setHeader("Content-Type", "application/json");
    res.send(data);

  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: true,
    owner: "@sahilxalone",
    endpoint: "/api/tg?key=permanant&info=@username"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
