import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3002;

const NVIDIA_API_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const NVIDIA_MODEL = "mistralai/mistral-medium-3.5-128b";

if (!process.env.NVIDIA_API_KEY) {
  throw new Error("NVIDIA_API_KEY is missing from ai-service/.env");
}

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "Foodable AI service is running.",
  });
});

app.post("/chat", async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Please enter a message.",
    });
  }

  try {
    const response = await axios.post(
      NVIDIA_API_URL,
      {
        model: NVIDIA_MODEL,
        reasoning_effort: "high",
        messages: [
          {
            role: "system",
            content: `
You are Foodable, an AI assistant that helps users:

- Create affordable grocery lists
- Find budget-friendly recipes
- Plan healthy meals
- Reduce food waste
- Understand general nutrition information

Give clear, practical, and organized answers.
Respect dietary restrictions provided by the user.
Explain that grocery prices are estimates and vary by location.
Do not diagnose medical conditions or provide medical treatment.
            `,
          },
          {
            role: "user",
            content: message.trim(),
          },
        ],
        max_tokens: 2200,
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
      },
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    console.log("========== NVIDIA RESPONSE ==========");
    console.dir(response.data, { depth: null });
    console.log("====================================");

    if (!reply) {
      return res.status(502).json({
        error: "The AI model returned an empty response.",
      });
    }

    return res.json({
      reply,
    });
  } catch (error) {
    console.error(
      "NVIDIA API error:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.error?.message ||
        "Foodable could not contact the AI service.",
    });
  }
});

app.listen(port, () => {
  console.log(`Foodable AI service running at http://localhost:${port}`);
});