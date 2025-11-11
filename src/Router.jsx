import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./MainComponent/Home.jsx";
import Welcome from "./MainComponent/Welcome.jsx";
import Signup from "./MainComponent/Signup.jsx";
import Login from "./MainComponent/Login.jsx";
import Quze from "./QuizComponent/Quze.jsx";

// ✅ Guard: Allow only logged-in users
const RequireAuth = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser ? children : <Navigate to="/login" replace />;
};

// ✅ Guard: Prevent logged-in users from going to login/signup
const RedirectIfAuth = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser ? <Navigate to="/quiz" replace /> : children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Welcome /> },
      { path: "home", element: <Welcome /> },
      { path: "signup", element: <RedirectIfAuth><Signup /></RedirectIfAuth> },
      { path: "login", element: <RedirectIfAuth><Login /></RedirectIfAuth> },
      {
        path: "quiz",
        element: (
          <RequireAuth>
            <Quze />
          </RequireAuth>
        ),
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
