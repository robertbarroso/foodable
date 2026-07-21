import { useState } from "react";

function SignUpForm() {
  // User input states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleUsername = (event) => {
    setUserName(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div id="user-auth">
      <section id="sign-up-form">
        <form id="sign-up-section">
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
            value={username}
            onChange={handleUsername}
            placeholder="Username"
          ></input>

          <label htmlFor="password-input"></label>
          <input
            className="sign-up-textfield"
            id="password-input"
            type="text"
            value={password}
            onChange={handlePassword}
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
        <form id="sign-in-section">
          <label htmlFor="username-input"></label>
          <input
            className="sign-up-textfield"
            id="username-input"
            type="text"
            value={username}
            onChange={handleUsername}
            placeholder="Username"
          ></input>

          <label htmlFor="password-input"></label>
          <input
            className="sign-up-textfield"
            id="password-input"
            type="text"
            value={password}
            onChange={handlePassword}
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
