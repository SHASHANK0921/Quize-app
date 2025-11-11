import React from "react";
import "./Welcome.css";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome">
      <section className="welcome-section">
        <h1>Welcome to the Ultimate Quiz Challenge!</h1>
        <p>Test your knowledge in Java & React and earn your gold crown 👑</p>
        <Link to="/quiz">
          <button className="start-btn">Start Quiz</button>
        </Link>
      </section>
    </div>
  );
};

export default Welcome;
