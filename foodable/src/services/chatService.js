// src/services/chatService.js

const AI_SERVICE_URL = "http://localhost:3002";

export async function sendChatMessage(message) {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Foodable could not contact the AI service.",
      );
    }

    return {
      reply: data.reply,
    };
  } catch (error) {
    console.error("Chat Service Error:", error);

    throw new Error(
      error.message || "Unable to connect to the Foodable AI service.",
    );
  }
}