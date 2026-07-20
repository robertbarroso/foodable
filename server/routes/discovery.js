import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      directory = "farmersmarket",
      zip,
      radius = "30",
      city,
      state,
    } = req.query;

    const validDirectories = [
      "agritourism",
      "csa",
      "farmersmarket",
      "foodhub",
      "onfarmmarket",
    ];

    if (!validDirectories.includes(directory)) {
      return res.status(400).json({
        error: "Invalid directory type.",
      });
    }

    if (!zip && !(city && state)) {
      return res.status(400).json({
        error: "Please enter a ZIP code or a city and state.",
      });
    }

    const params = new URLSearchParams({
      apikey: process.env.USDA_LOCAL_FOOD_API_KEY,
    });

    if (zip) {
      params.append("zip", zip);
      params.append("radius", radius);
    } else {
      params.append("city", city);
      params.append("state", state);
    }

    const url =
      `https://www.usdalocalfoodportal.com/api/${directory}/?` +
      params.toString();

    const response = await fetch(url);

    if (!response.ok) {
        const text = await response.text();

        console.log("USDA Status:", response.status);
        console.log("USDA Response:", text);

        return res.status(response.status).json({
            error: text,
  });
}

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Discovery route error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

export default router;