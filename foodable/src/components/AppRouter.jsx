import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import NavBar from "./NavBar.jsx";
import AIChatbot from "../pages/AIChatbot.jsx";
import RecipeList from "../pages/RecipeList.jsx";
import GroceryList from "../pages/GroceryList.jsx";
import SocialFeed from "../pages/SocialFeed.jsx";
import Discovery from "../pages/Discovery";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-chat" element={<AIChatbot />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/groceries" element={<GroceryList />} />
        <Route path="/community" element={<SocialFeed />} />
        <Route path="/discovery" element={<Discovery />} />
      </Routes>
    </BrowserRouter>
  );
}
