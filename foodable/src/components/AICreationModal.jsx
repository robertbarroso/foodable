import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/chatService.js";
import "./AICreationModal.css";

function AICreationModal({ mode, onClose, onCreated }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const isRecipeMode = mode === "recipe";

  async function handleGenerate(event) {
    event.preventDefault();

    const prompt = input.trim();

    if (!prompt || isGenerating) {
      return;
    }

    setError("");
    setResult("");
    setIsGenerating(true);

    const creationPrompt = isRecipeMode
      ? `Create a complete recipe based on this request: ${prompt}`
      : `Create a complete grocery list based on this request: ${prompt}`;

    try {
      const response = await sendChatMessage(creationPrompt);
      setResult(response.reply);
    } catch (requestError) {
      console.error("AI creation error:", requestError);

      setError(
        requestError.message ||
          `Foodable could not create the ${
            isRecipeMode ? "recipe" : "grocery list"
          }.`,
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSave() {
    // Temporary until structured saving is connected.
    onCreated?.(result);
  }

  return (
    <div className="ai-modal-backdrop" role="presentation">
      <section
        className="ai-creation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-creation-title"
      >
        <div className="ai-modal-header">
          <h2 id="ai-creation-title">
            Create {isRecipeMode ? "a Recipe" : "a Grocery List"} with AI
          </h2>

          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <form onSubmit={handleGenerate}>
          <label htmlFor="ai-creation-input">
            Describe what you want Foodable to create
          </label>

          <textarea
            id="ai-creation-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              isRecipeMode
                ? "Create a healthy chicken dinner under $15."
                : "Create a grocery list for two people under $60."
            }
            maxLength={2000}
            disabled={isGenerating}
          />

          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? "Creating..." : "Generate"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="ai-creation-result">
            <ReactMarkdown>{result}</ReactMarkdown>

            <div className="ai-modal-actions">
              <button type="button" onClick={handleSave}>
                Save {isRecipeMode ? "Recipe" : "Grocery List"}
              </button>

              <button type="button" onClick={() => setResult("")}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AICreationModal;