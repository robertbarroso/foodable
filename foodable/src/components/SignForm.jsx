import { useState } from "react";

function SignUpForm() {
  // User input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // For sign-up
  const [usernameSignUp, setUserNameSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");

  // For sign-In
  const [usernameSignIn, setUserNameSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameSignUp = (event) => {
    setUserNameSignUp(event.target.value);
  };

  const handleUsernameSignIn = (event) => {
    setUserNameSignIn(event.target.value);
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

    try {
      const signupForm = {
        firstName,
        lastName,
        email,
        usernameSignUp,
        passwordSignUp,
      };

      const signupResponse = await fetch(
        "http://localhost:5001/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupForm),
        },
      );

      const signupData = await signupResponse.json();
      console.log(signupData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const signinForm = {
        email,
        passwordSignIn,
      };

      const signinResponse = await fetch(
        "http://localhost:5001/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signinForm),
        },
      );

      const signinData = await signinResponse.json();
      console.log(signinData);
    } catch (error) {
      console.error(error);
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

          <label htmlFor="email-input"></label>
          <input
            className="sign-up-textfield"
            id="email-input"
            type="text"
            value={email}
            onChange={handleEmail}
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
          <label htmlFor="email-input"></label>
          <input
            className="sign-up-textfield"
            id="email-input"
            type="text"
            value={email}
            onChange={handleEmail}
            placeholder="Email"
          ></input>

          <label htmlFor="password-input"></label>
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
