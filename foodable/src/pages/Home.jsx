import "./Home.css";
import foodimg from "../assets/free-source-food-img.jpg";
import SignUpForm from "../components/SignForm";

export default function Home() {
  return (
    <div id="home-area">
      <h3 id="home-header">Welcome to Foodable</h3>
      <div id="home-separator">
        <div id="home-content">
          <h2>
            The App for Food Budgeting, Discovering Local Products, and Recipes
            for Delicious and Nutritious Meals!
          </h2>
          <SignUpForm />
        </div>
        <img src={foodimg} alt="Plant Images" id="food-img" />
      </div>
      <footer>
        <p>&copy; 2026 Foodable. All rights reserved.</p>
      </footer>
    </div>
  );
}
