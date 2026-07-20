import express from "express";
import axios from "axios";

const router = express.Router();

const NVIDIA_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const NVIDIA_MODEL = "mistralai/mistral-medium-3.5-128b";

router.post("/", async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Please enter a message.",
    });
  }

  const cleanedMessage = message.trim();

  if (process.env.USE_MOCK_AI === "true") {
    console.log(`Mock AI request: "${cleanedMessage}"`);

    return res.json({
      reply: createMockReply(cleanedMessage),
      mock: true,
    });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({
      error: "The NVIDIA API key is not configured.",
    });
  }

  try {
    console.log(`Sending request to NVIDIA: "${cleanedMessage}"`);

    const response = await axios.post(
      NVIDIA_API_URL,
      {
        model: NVIDIA_MODEL,
        messages: [
          {
            role: "system",
            content: `
You are Foodable, an AI assistant that helps users create affordable grocery
lists, find budget-friendly recipes, plan healthy meals, reduce food waste,
and understand general nutrition information.

Give clear, practical, and organized answers.
Use Markdown headings, numbered steps, and bullet points when helpful.
Respect dietary restrictions provided by the user.
Explain that grocery prices are estimates and vary by location.
Do not diagnose medical conditions or provide medical treatment.
            `.trim(),
          },
          {
            role: "user",
            content: cleanedMessage,
          },
        ],
        max_tokens: 700,
        temperature: 0.7,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 60000,
      },
    );

    console.log("========== NVIDIA RESPONSE ==========");
    console.dir(response.data, { depth: null });
    console.log("====================================");

    const reply = response.data?.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({
        error: "The AI model returned an empty response.",
      });
    }

    return res.json({
      reply: reply.trim(),
      mock: false,
    });
  } catch (error) {
    const upstreamStatus = error.response?.status;

    console.error("========== NVIDIA API ERROR ==========");
    console.error("Status:", upstreamStatus);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.dir(error.response?.data, { depth: null });
    console.error("======================================");

    if (upstreamStatus === 504 || error.code === "ECONNABORTED") {
      return res.status(503).json({
        error:
          "The AI provider is taking longer than expected. Please try again shortly.",
      });
    }

    return res.status(502).json({
      error:
        error.response?.data?.error?.message ||
        "The AI provider is temporarily unavailable.",
    });
  }
});

function createMockReply(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("grocery") ||
    lowerMessage.includes("shopping list")
  ) {
    return `
## Affordable Grocery List

### Protein

- Chicken thighs
- Eggs
- Canned black beans
- Plain Greek yogurt

### Grains

- Brown rice
- Oats
- Whole-wheat tortillas

### Produce

- Bananas
- Carrots
- Cabbage
- Frozen broccoli

### Pantry Items

- Salsa
- Peanut butter
- Canned tomatoes

## Budget Tip

Choose store brands and compare unit prices. Grocery prices are estimates and vary by location.
    `.trim();
  }

  if (
    lowerMessage.includes("recipe") ||
    lowerMessage.includes("chicken") ||
    lowerMessage.includes("dinner")
  ) {
    return `
## Chicken, Rice, and Broccoli Bowl

### Ingredients

- 1 pound chicken breast or thighs
- 2 cups cooked brown rice
- 2 cups frozen broccoli
- 1 tablespoon olive oil
- Garlic powder
- Black pepper
- Salsa or another preferred sauce

### Instructions

1. Season and cook the chicken until fully cooked.
2. Prepare the rice according to the package instructions.
3. Heat or steam the broccoli.
4. Divide the rice, chicken, and broccoli into bowls.
5. Add salsa or another sauce before serving.

## Nutrition Note

This meal provides protein, carbohydrates, vegetables, and fiber.
    `.trim();
  }

  if (
    lowerMessage.includes("vegetarian") ||
    lowerMessage.includes("meatless")
  ) {
    return `
## Affordable Vegetarian Meal Ideas

- Lentil tacos with cabbage and salsa
- Black bean and brown rice bowls
- Chickpea pasta with frozen vegetables
- Egg and vegetable breakfast burritos
- Peanut butter oatmeal with bananas

## Budget Tip

Beans, lentils, eggs, oats, and frozen vegetables are versatile ingredients that can be reused across several meals.
    `.trim();
  }

  if (
    lowerMessage === "hi" ||
    lowerMessage === "hello" ||
    lowerMessage === "hey"
  ) {
    return `
Hi! I'm the Foodable AI Assistant.

I can help you with:

- Affordable grocery lists
- Healthy meal plans
- Recipes using ingredients you already have
- Vegetarian meal ideas
- Healthy food substitutions
- General nutrition information

What would you like help with?
    `.trim();
  }

  return `
## Foodable Development Response

You asked:

> ${message}

This is a mock response being used while the external AI provider is experiencing high latency.

### Example Suggestions

- Build meals around affordable proteins such as beans, eggs, lentils, or chicken thighs.
- Use frozen vegetables to reduce cost and food waste.
- Choose ingredients that can be reused in several meals.
- Compare store-brand items using their unit prices.

Grocery prices and availability vary by location.
  `.trim();
}

export default router;