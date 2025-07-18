import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OAuthCallback from "./pages/OAuthCallback";
import Home from "./pages/Home";
import SessionExpired from "./pages/SessionExpired"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/home" element={<Home />} />
        <Route path="/session-expired" element={<SessionExpired />} />
      </Routes>
    </Router>
  );
}

export default App;
