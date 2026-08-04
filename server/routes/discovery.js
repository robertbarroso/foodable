import express from "express";

const router = express.Router();

const validDirectories = [
  "agritourism",
  "csa",
  "farmersmarket",
  "foodhub",
  "onfarmmarket",
];

router.get("/", async (req, res) => {
  try {
    const directory = String(
      req.query.directory || "farmersmarket"
    ).toLowerCase();

    const zip = req.query.zip ? String(req.query.zip).trim() : "";
    const city = req.query.city ? String(req.query.city).trim() : "";
    const state = req.query.state
      ? String(req.query.state).trim().toUpperCase()
      : "";

    const radius = Number(req.query.radius || 30);

    if (!process.env.USDA_LOCAL_FOOD_API_KEY) {
      console.error("USDA_LOCAL_FOOD_API_KEY is not configured.");

      return res.status(500).json({
        error: {
          code: "SERVER_CONFIGURATION_ERROR",
          message: "The discovery service is not configured correctly.",
        },
      });
    }

    if (!validDirectories.includes(directory)) {
      return res.status(400).json({
        error: {
          code: "INVALID_DIRECTORY",
          message: "Please select a valid directory type.",
        },
      });
    }

    if (!zip && !(city && state)) {
      return res.status(400).json({
        error: {
          code: "LOCATION_REQUIRED",
          message: "Please enter a ZIP code or a city and state.",
        },
      });
    }

    if (zip && !/^\d{5}$/.test(zip)) {
      return res.status(400).json({
        error: {
          code: "INVALID_ZIP",
          message: "ZIP code must contain exactly five digits.",
        },
      });
    }

    if (!Number.isInteger(radius) || radius < 1 || radius > 100) {
      return res.status(400).json({
        error: {
          code: "INVALID_RADIUS",
          message: "Radius must be a whole number between 1 and 100 miles.",
        },
      });
    }

    if (!zip && !/^[A-Z]{2}$/.test(state)) {
      return res.status(400).json({
        error: {
          code: "INVALID_STATE",
          message: "State must use a valid two-letter abbreviation.",
        },
      });
    }

    const params = new URLSearchParams({
      apikey: process.env.USDA_LOCAL_FOOD_API_KEY,
    });

    if (zip) {
      params.append("zip", zip);
      params.append("radius", String(radius));
    } else {
      params.append("city", city);
      params.append("state", state);
    }

    const url =
      `https://www.usdalocalfoodportal.com/api/${directory}/?` +
      params.toString();

    const response = await fetch(url);

    if (!response.ok) {
      const responseText = await response.text();

      console.error("USDA API request failed:", {
        status: response.status,
        response: responseText,
      });

      return res.status(502).json({
        error: {
          code: "USDA_REQUEST_FAILED",
          message:
            "Local food locations could not be retrieved. Please try again.",
        },
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Discovery route error:", error);

    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
      },
    });
  }
});

export default router;