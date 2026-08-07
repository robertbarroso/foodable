import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const zip = req.query.zip ? String(req.query.zip).trim() : "";
    const radiusMiles = Number(req.query.radius || 10);

    if (!process.env.GEOAPIFY_API_KEY) {
      console.error("GEOAPIFY_API_KEY is not configured.");

      return res.status(500).json({
        error: {
          code: "SERVER_CONFIGURATION_ERROR",
          message: "The discovery service is not configured correctly.",
        },
      });
    }

    if (!/^\d{5}$/.test(zip)) {
      return res.status(400).json({
        error: {
          code: "INVALID_ZIP",
          message: "Please enter a valid five-digit ZIP code.",
        },
      });
    }

    if (
      !Number.isFinite(radiusMiles) ||
      radiusMiles < 1 ||
      radiusMiles > 50
    ) {
      return res.status(400).json({
        error: {
          code: "INVALID_RADIUS",
          message: "Radius must be between 1 and 50 miles.",
        },
      });
    }

    const geocodeParams = new URLSearchParams({
      text: zip,
      type: "postcode",
      filter: "countrycode:us",
      limit: "1",
      format: "json",
      apiKey: process.env.GEOAPIFY_API_KEY,
    });

    const geocodeUrl =
      `https://api.geoapify.com/v1/geocode/search?` +
      geocodeParams.toString();

    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      const responseText = await geocodeResponse.text();

      console.error("Geoapify geocoding request failed:", {
        status: geocodeResponse.status,
        response: responseText,
      });

      return res.status(502).json({
        error: {
          code: "GEOCODING_REQUEST_FAILED",
          message: "The ZIP code could not be located. Please try again.",
        },
      });
    }

    const geocodeData = await geocodeResponse.json();
    const location = geocodeData.results?.[0];

    if (!location) {
      return res.status(404).json({
        error: {
          code: "LOCATION_NOT_FOUND",
          message: "No location was found for that ZIP code.",
        },
      });
    }

    const { lat, lon } = location;

    const radiusMeters = Math.round(radiusMiles * 1609.344);

    const categories = [
      "commercial.supermarket",
      "commercial.food_and_drink.health_food",
      "commercial.food_and_drink.organic",
      "commercial.food_and_drink.fruit_and_vegetable",
    ].join(",");

    const placesParams = new URLSearchParams({
      categories,
      filter: `circle:${lon},${lat},${radiusMeters}`,
      bias: `proximity:${lon},${lat}`,
      limit: "20",
      lang: "en",
      apiKey: process.env.GEOAPIFY_API_KEY,
    });

    const placesUrl =
      `https://api.geoapify.com/v2/places?` +
      placesParams.toString();

    const placesResponse = await fetch(placesUrl);

    if (!placesResponse.ok) {
      const responseText = await placesResponse.text();

      console.error("Geoapify Places request failed:", {
        status: placesResponse.status,
        response: responseText,
      });

      return res.status(502).json({
        error: {
          code: "PLACES_REQUEST_FAILED",
          message: "Nearby food locations could not be retrieved.",
        },
      });
    }

    const placesData = await placesResponse.json();

    const places = (placesData.features || [])
      .map((feature) => {
        const properties = feature.properties || {};

        return {
          id: properties.place_id,
          name: properties.name || properties.address_line1 || "Food retailer",
          address: properties.formatted || "",
          addressLine1: properties.address_line1 || "",
          addressLine2: properties.address_line2 || "",
          city: properties.city || "",
          state: properties.state_code || properties.state || "",
          zip: properties.postcode || "",
          latitude: properties.lat,
          longitude: properties.lon,
          distanceMeters: properties.distance ?? null,
          distanceMiles:
            typeof properties.distance === "number"
              ? Number((properties.distance / 1609.344).toFixed(1))
              : null,
          categories: properties.categories || [],
        };
      })
      .filter((place) => place.id);

    return res.status(200).json({
      location: {
        zip,
        city: location.city || "",
        state: location.state_code || location.state || "",
        latitude: lat,
        longitude: lon,
      },
      count: places.length,
      places,
    });
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