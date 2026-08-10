import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Context
import { selectUser } from "../auth/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

function SignUpForm() {
  const navigate = useNavigate();
  const { setCurrentUser } = selectUser();

  // User input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [emailSignUp, setEmailSignUp] = useState("");
  const [emailSignIn, setEmailSignIn] = useState("");
  // For sign-up
  const [usernameSignUp, setUserNameSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");

  // For sign-In
  const [passwordSignIn, setPasswordSignIn] = useState("");

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailSignUp = (event) => {
    setEmailSignUp(event.target.value);
  };

  const handleEmailSignIn = (event) => {
    setEmailSignIn(event.target.value);
  };

  const handleUsernameSignUp = (event) => {
    setUserNameSignUp(event.target.value);
  };

  const handlePasswordSignUp = (event) => {
    setPasswordSignUp(event.target.value);
  };

  const handlePasswordSignIn = (event) => {
    setPasswordSignIn(event.target.value);
  };

  /* 
  Supabase Functions
    handleSignUp -> Prepares for signup
    handleSignIn -> Prepares for signin
  */
  const handleSignUp = async (event) => {
    event.preventDefault();

    const toastId = toast.loading("Attempting to sign up...")

    // Username validation
    if (usernameSignUp.length < 6) {
      toast.error("Username must be at least 6 characters.");
      return;
    }

    // Password validation
    if (passwordSignUp.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      const signupForm = {
        firstName,
        lastName,
        email: emailSignUp,
        usernameSignUp,
        passwordSignUp,
      };

      const signupResponse = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupForm),
      });

      const signupData = await signupResponse.json();

      if (signupData.success) {
        toast.success("Account created. Please sign in.", {id: toastId});
        navigate("/");
        return;
      }

      toast.error(signupData.message || "Sign up failed", {id: toastId});
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Sign up failed", {id: toastId});
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    
    const toastId = toast.loading("Attempting to log in...")

    try {
      const signinForm = {
        email: emailSignIn,
        passwordSignIn,
      };

      const signinResponse = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinForm),
      });

      const signinData = await signinResponse.json();

      if (signinData.success) {
        // Save access token, otherwise null
        const currentUserAccessToken = signinData.session?.access_token;

        // If the token is valid,
        if (currentUserAccessToken) {
          // Save in to local storage for persistence.
          localStorage.setItem("supabase_access_token", currentUserAccessToken);
        }

        setCurrentUser(signinData.profile);
        localStorage.setItem(
          "supabase_profile",
          JSON.stringify(signinData.profile),
        );

        toast.success(
          `Welcome back${signinData.profile?.first_name ? `, ${signinData.profile.first_name}` : ""}!`, {id: toastId}
        );
        navigate("/");
        return;
      }

      toast.error(signinData.message || "Sign in failed", {id: toastId});
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Sign in failed", {id: toastId});
    }
  };

  return (
    <div id="user-auth">
      <section id="sign-up-form">
        <form id="sign-up-section" onSubmit={handleSignUp}>
          <h3>Sign Up</h3>
          <label htmlFor="first-name-input"></label>

          <input
            className="sign-up-textfield"
            id="first-name-input"
            type="text"
            value={firstName}
            onChange={handleFirstName}
            placeholder="First Name"
          ></input>

          <label htmlFor="last-name-input"></label>
          <input
            className="sign-up-textfield"
            id="last-name-input"
            type="text"
            value={lastName}
            onChange={handleLastName}
            placeholder="Last Name"
          ></input>

          <label htmlFor="signup-email-input"></label>
          <input
            className="sign-up-textfield"
            id="signup-email-input"
            type="email"
            value={emailSignUp}
            onChange={handleEmailSignUp}
            placeholder="Email"
          ></input>

          <label htmlFor="username-input"></label>
          <input
            className="sign-up-textfield"
            id="username-input"
            type="text"
            value={usernameSignUp}
            onChange={handleUsernameSignUp}
            placeholder="Username"
          ></input>

          <label htmlFor="password-input"></label>
          <input
            className="sign-up-textfield"
            id="password-input-signup"
            type="password"
            value={passwordSignUp}
            onChange={handlePasswordSignUp}
            placeholder="Password"
          ></input>

          <button
            type="submit"
            id="sign-up-button"
            className="user-auth-button"
          >
            Sign Up
          </button>
        </form>
      </section>

      <section id="sign-in-form">
        <h3>Sign In</h3>
        <form id="sign-in-section" onSubmit={handleSignIn}>
          <label htmlFor="signin-email-input"></label>
          <input
            className="sign-up-textfield"
            id="signin-email-input"
            type="text"
            value={emailSignIn}
            onChange={handleEmailSignIn}
            placeholder="Email"
          ></input>

          <label htmlFor="password-input-signin"></label>
          <input
            className="sign-up-textfield"
            id="password-input-signin"
            type="password"
            value={passwordSignIn}
            onChange={handlePasswordSignIn}
            placeholder="Password"
          ></input>

          <button
            type="submit"
            id="sign-in-button"
            className="user-auth-button"
          >
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}

export default SignUpForm;
