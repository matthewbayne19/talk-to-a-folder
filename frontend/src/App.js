import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import OAuthCallback from "./pages/OAuthCallback";
import Home from "./pages/Home";
import SessionExpired from "./pages/SessionExpired";

// Route protection wrapper
function ProtectedRoutes() {
  const location = useLocation();
  const isSignedIn = Boolean(localStorage.getItem("access_token"));

  // If signed in, only allow /home, otherwise redirect to /home
  if (isSignedIn) {
    if (location.pathname !== "/home") {
      return <Navigate to="/home" replace />;
    }
    return <Home />;
  }

  // If not signed in, only allow /, /oauth-callback, /session-expired
  if (location.pathname === "/") {
    return <Landing />;
  }
  if (location.pathname === "/oauth-callback") {
    return <OAuthCallback />;
  }
  if (location.pathname === "/session-expired") {
    return <SessionExpired />;
  }
  // Any other route, redirect to landing
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
