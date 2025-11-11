import React, { useState, useEffect } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Disable submit if any field is empty
    const { username, email, password } = formData;
    setIsButtonDisabled(!(username && email && password));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.some(
      (user) => user.email === formData.email
    );

    if (userExists) {
      setDuplicateEmail(formData.email);
      setMessage("⚠️ This email is already registered. You can delete it below.");
      return;
    }

    const updatedUsers = [...existingUsers, formData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setMessage("✅ Signup successful! Redirecting to login...");

    setFormData({ username: "", email: "", password: "" });
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleDeleteExisting = (emailToDelete) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const filtered = existingUsers.filter((u) => u.email !== emailToDelete);
    localStorage.setItem("users", JSON.stringify(filtered));
    const logged = JSON.parse(localStorage.getItem("loggedInUser"));
    if (logged && logged.email === emailToDelete) {
      localStorage.removeItem("loggedInUser");
    }
    setMessage("🗑️ Account deleted! You can sign up again now.");
    setDuplicateEmail(null);
  };

  return (
    <div className="signup">
      <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={isButtonDisabled}
        >
          Sign Up
        </button>

        {message && (
          <p
            className={`message ${
              message.startsWith("⚠️") ? "warning" : "success"
            }`}
          >
            {message}
          </p>
        )}

        {duplicateEmail && (
          <button
            type="button"
            className="delete-btn"
            onClick={() => handleDeleteExisting(duplicateEmail)}
          >
            Delete account for {duplicateEmail}
          </button>
        )}
      </form>
    </div>
  );
};

export default Signup;
