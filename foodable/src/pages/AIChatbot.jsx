import { useEffect, useState } from "react"; // Added useEffect
import ReactMarkdown from "react-markdown";
import {
  sendChatMessage,
  getChatHistory, // Import history loader
  clearChatHistory,
} from "../services/chatService.js";

const starterMessage = {
  role: "assistant",
  content:
    "Hi! I’m the Foodable AI Assistant. Ask me about affordable meal ideas, grocery lists, recipes, or general nutrition information.",
};

function AIChat() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Loading state while fetching previous chat history
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [error, setError] = useState("");

  // Load previous chat history when the page first loads
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const savedMessages = await getChatHistory();

        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (historyError) {
        console.error("Unable to load chat history:", historyError);

        setError(
          historyError.message ||
            "Foodable could not load your previous messages.",
        );
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadChatHistory();
  }, []);

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

  // Clear the user's saved chat history
async function handleClearChat() {
  const shouldClear = window.confirm(
    "Are you sure you want to clear your chat history?",
  );

  if (!shouldClear) {
    return;
  }

  try {
    await clearChatHistory();

    // Reset the chat window back to the starter message
    setMessages([starterMessage]);
    setError("");
  } catch (clearError) {
    console.error("Unable to clear chat history:", clearError);

    setError(
      clearError.message ||
        "Unable to clear chat history.",
    );
  }
}
  return (
    <main className="ai-chat-page">
      <header className="ai-chat-header">
        <div>
          <h1>Foodable AI Assistant</h1>

          <p>Get help creating affordable meals, grocery lists, and recipes.</p>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          disabled={isLoading || isLoadingHistory}
        >
          Clear Chat
        </button>
        
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
            handleSuggestedPrompt("Suggest three affordable vegetarian meals.")
          }
          disabled={isLoading}
        >
          Vegetarian meals
        </button>
      </section>

      <section className="chat-messages" aria-live="polite">

        {/* Display while previous messages are loading */}
        {isLoadingHistory && (
          <p className="loading-message">
            Loading previous messages...
          </p>
        )}

        {/* Wait until history finishes loading before rendering messages */}
        {!isLoadingHistory &&
          messages.map((message, index) => (
            <article
              className={`chat-message chat-message-${message.role}`}
              key={message.id || `${message.role}-${index}`} // Use database id when available
            >
              <strong>{message.role === "user" ? "You" : "Foodable"}</strong>

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
            placeholder="Ask for a recipe, meal idea, or grocery list..."
            maxLength={2000}

            // Disable input while history is loading
            disabled={isLoading || isLoadingHistory}
          />

          <button
            type="submit"

            // Prevent sending messages until history has loaded
            disabled={
              isLoading ||
              isLoadingHistory ||
              !input.trim()
            }
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AIChat;