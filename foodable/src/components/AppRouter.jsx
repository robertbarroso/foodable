import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import AIChatbot from "../pages/AIChatbot.jsx";
import RecipeList from "../pages/RecipeList.jsx";
import GroceryList from "../pages/GroceryList.jsx";
import SocialFeed from "../pages/SocialFeed.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/groceries" replace />} />
        <Route path="/ai-chat" element={<AIChatbot />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/groceries" element={<GroceryList />} />
        <Route path="/community" element={<SocialFeed />} />
      </Routes>
    </BrowserRouter>
  );
}
