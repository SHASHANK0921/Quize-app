import React from "react";
import "./Home.css";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // Delete Account
  const handleDeleteMyAccount = () => {
    if (!loggedInUser) return;
    if (!window.confirm("Delete your account permanently?")) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const filtered = users.filter((u) => u.email !== loggedInUser.email);
    localStorage.setItem("users", JSON.stringify(filtered));
    localStorage.removeItem("loggedInUser");
    navigate("/signup");
  };

  const isHomePage =
    location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">QUIZ APP</h1>
        </div>

        <div className="navbar-right">
          {!isHomePage && (
            <Link to="/home">
              <button className="nav-btn">Home</button>
            </Link>
          )}

          {loggedInUser ? (
            <>
              <button className="nav-btn" onClick={handleDeleteMyAccount}>
                Delete Account
              </button>
              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="nav-btn">Login</button>
              </Link>
              <Link to="/signup">
                <button className="nav-btn">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default Home;
