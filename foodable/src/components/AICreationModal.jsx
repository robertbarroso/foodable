import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/chatService.js";
import {
  createGroceryList,
  createGroceryListItem,
} from "../services/groceryLists.js";
import "./AICreationModal.css";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

function AICreationModal({ mode, onClose, onCreated }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // --- AI RECIPE SAVE INTEGRATION ---
  const [recipeData, setRecipeData] = useState(null);

  // --- AI GROCERY SAVE INTEGRATION ---
  const [groceryData, setGroceryData] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const isRecipeMode = mode === "recipe";

  async function handleGenerate(event) {
    event.preventDefault();

    const prompt = input.trim();

    if (!prompt || isGenerating) {
      return;
    }

    setError("");
    setResult("");
    setRecipeData(null);
    setGroceryData(null);
    setIsGenerating(true);

    const creationPrompt = isRecipeMode
      ? `
Create a complete recipe based on this request: ${prompt}

Return ONLY valid JSON.
Do not include markdown, code fences, or any text outside the JSON.

Use exactly this structure:

{
  "title": "Recipe title",
  "description": "Short recipe description",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "ingredient_cost": 0,
  "ingredients": [
    {
      "name": "Ingredient name",
      "quantity": "Amount",
      "cost": 0
    }
  ],
  "instructions": [
    "First instruction",
    "Second instruction"
  ],
  "is_public": false
}

Use numbers for calories, protein, carbs, fat, ingredient_cost, and ingredient costs.
Estimate nutrition and ingredient costs when necessary.
`
      : `
Create a complete grocery list based on this request: ${prompt}

Return ONLY valid JSON.
Do not include markdown, code fences, or any text outside the JSON.

Use exactly this structure:

{
  "title": "Grocery list title",
  "budget_estimate": 0,
  "is_public": false,
  "items": [
    {
      "name": "Item name",
      "quantity": "Amount",
      "category": "Category",
      "price": 0
    }
  ]
}

Use numbers for budget_estimate and item prices.
Estimate prices when necessary.
`;

    try {
      const response = await sendChatMessage(creationPrompt);

      const cleanedResponse = response.reply
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      if (isRecipeMode) {
        // --- AI RECIPE SAVE INTEGRATION ---
        const parsedRecipe = JSON.parse(cleanedResponse);
        setRecipeData(parsedRecipe);
      } else {
        // --- AI GROCERY SAVE INTEGRATION ---
        const parsedGroceryList = JSON.parse(cleanedResponse);
        setGroceryData(parsedGroceryList);
      }
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

  async function handleSave() {
    // --- AI RECIPE SAVE INTEGRATION ---
    if (isRecipeMode) {
      if (!recipeData || isSaving) {
        return;
      }

      setIsSaving(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("supabase_access_token")}`
          },
          body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(
            data?.error?.message ||
              data?.error ||
              "Foodable could not save the recipe.",
          );
        }

        const savedRecipe = await response.json();

        onCreated?.(savedRecipe);
      } catch (saveError) {
        console.error("Recipe save error:", saveError);

        setError(
          saveError.message || "Foodable could not save the recipe.",
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    // --- AI GROCERY SAVE INTEGRATION ---
    if (!groceryData || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const createdList = await createGroceryList({
        title: groceryData.title,
        budget_estimate: groceryData.budget_estimate ?? null,
        is_public: groceryData.is_public ?? false,
      });

      for (const item of groceryData.items ?? []) {
        await createGroceryListItem(createdList.id, {
          name: item.name,
          quantity: item.quantity ?? null,
          category: item.category ?? null,
          price: item.price ?? null,
        });
      }

      onCreated?.(createdList);
    } catch (saveError) {
      console.error("Grocery save error:", saveError);

      setError(
        saveError.message ||
          "Foodable could not save the grocery list.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleTryAgain() {
    setResult("");
    setRecipeData(null);
    setGroceryData(null);
    setError("");
  }

  return (
    <div className="ai-modal-backdrop">
      <section className="ai-creation-modal">
        <div className="ai-modal-header">
          <h2>
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

        {/* --- AI RECIPE PREVIEW --- */}
        {isRecipeMode && recipeData && (
          <div className="ai-creation-result">
            <h2>{recipeData.title}</h2>

            <p>{recipeData.description}</p>

            <h3>Nutrition</h3>
            <p>
              Calories: {recipeData.calories} | Protein:{" "}
              {recipeData.protein}g | Carbs: {recipeData.carbs}g | Fat:{" "}
              {recipeData.fat}g
            </p>

            <p>
              Estimated ingredient cost: $
              {Number(recipeData.ingredient_cost || 0).toFixed(2)}
            </p>

            <h3>Ingredients</h3>
            <ul>
              {recipeData.ingredients?.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.name}
                  {ingredient.cost != null &&
                    ` - $${Number(ingredient.cost).toFixed(2)}`}
                </li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <ol>
              {recipeData.instructions?.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>

            <div className="ai-modal-actions">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Recipe"}
              </button>

              <button
                type="button"
                onClick={handleTryAgain}
                disabled={isSaving}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* --- AI GROCERY LIST PREVIEW --- */}
        {!isRecipeMode && groceryData && (
          <div className="ai-creation-result">
            <h2>{groceryData.title}</h2>

            <p>
              Estimated budget: $
              {Number(groceryData.budget_estimate || 0).toFixed(2)}
            </p>

            <h3>Items</h3>
            <ul>
              {groceryData.items?.map((item, index) => (
                <li key={index}>
                  {item.quantity && `${item.quantity} `}
                  {item.name}
                  {item.category && ` (${item.category})`}
                  {item.price != null &&
                    ` - $${Number(item.price).toFixed(2)}`}
                </li>
              ))}
            </ul>

            <div className="ai-modal-actions">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Grocery List"}
              </button>

              <button
                type="button"
                onClick={handleTryAgain}
                disabled={isSaving}
              >
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