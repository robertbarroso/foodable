import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/chatService.js";

const starterMessage = {
  role: "assistant",
  content:
    "Hi! I’m the Foodable AI Assistant. Ask me about affordable meal ideas, grocery lists, recipes, or general nutrition information.",
};

function AIChat() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage(message);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch (requestError) {
      console.error("Foodable chatbot error:", requestError);

      setError(
        requestError.message ||
          "Foodable could not generate a response. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestedPrompt(prompt) {
    setInput(prompt);
    setError("");
  }

  return (
    <main className="ai-chat-page">
      <header className="ai-chat-header">
        <h1>Foodable AI Assistant</h1>

        <p>
          Get help creating affordable meals, grocery lists, and recipes.
        </p>
      </header>

      <section className="suggested-prompts">
        <button
          type="button"
          onClick={() =>
            handleSuggestedPrompt(
              "Create a grocery list for two people with a $60 budget.",
            )
          }
          disabled={isLoading}
        >
          Grocery list under $60
        </button>

        <button
          type="button"
          onClick={() =>
            handleSuggestedPrompt(
              "Create a healthy dinner using chicken, rice, and vegetables.",
            )
          }
          disabled={isLoading}
        >
          Healthy dinner idea
        </button>

        <button
          type="button"
          onClick={() =>
            handleSuggestedPrompt(
              "Suggest three affordable vegetarian meals.",
            )
          }
          disabled={isLoading}
        >
          Vegetarian meals
        </button>
      </section>

      <section className="chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <article
            className={`chat-message chat-message-${message.role}`}
            key={`${message.role}-${index}`}
          >
            <strong>
              {message.role === "user" ? "You" : "Foodable"}
            </strong>

            {message.role === "assistant" ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <p>{message.content}</p>
            )}
          </article>
        ))}

        {isLoading && (
          <p className="loading-message">Foodable is thinking...</p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </section>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Ask Foodable</label>

        <div className="chat-input-row">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Create a healthy sandwich recipe..."
            maxLength={2000}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AIChat;