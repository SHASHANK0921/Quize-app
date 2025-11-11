import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // disable submit when fields empty
    setIsButtonDisabled(!(email && password));
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/quiz"), 1500);
    } else {
      setMessage("❌ Invalid email or password!");
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Login to Your Account</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={isButtonDisabled}
        >
          Login
        </button>

        {message && (
          <p
            className={`message ${
              message.includes("❌") ? "warning" : "success"
            }`}
          >
            {message}
          </p>
        )}

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
