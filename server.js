app.get("/api/tg", async (req, res) => {
  try {
    const { key, info } = req.query;

    if (key !== "permanant") {
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

    const response = await axios.get(
      `https://api.aerivue.dev/tg?query=${encodeURIComponent(info)}`
    );

    let data = response.data;

    if (typeof data === "string") {
      data = data
        .replace(/By\s*@aerivue/gi, "By @sahilxalone")
        .replace(/@aerivue/gi, "@sahilxalone");

      return res.send(data);
    }

    const modified = JSON.parse(
      JSON.stringify(data)
        .replace(/By\s*@aerivue/gi, "By @sahilxalone")
        .replace(/@aerivue/gi, "@sahilxalone")
    );

    res.json(modified);

  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
});
