// Landing.jsx
// Landing page for unauthenticated users: shows title, description, and login button.

import React from "react";
import axios from "axios";
import { Box, Button, Typography, Container } from "@mui/material";

// Landing page component
function Landing() {
  // Handles Google OAuth login and ripple effect on button
  const [error, setError] = React.useState("");
  const getAuthUrl = async (e) => {
    // Ripple effect
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);

    // Redirect to Google OAuth
    try {
      setError("");
      const res = await axios.get("http://localhost:4000/auth-url");
      window.location.href = res.data.url;
    } catch (err) {
      setError("The server is currently unavailable. Please make sure the backend is running and try again.");
      console.error("Failed to get auth URL:", err.message);
    }
  };

  return (
    <div className="landing-gradient-bg">
      <Box
        sx={{
          minHeight: "100vh",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              gap: 5,
            }}
          >
            {/* Main title */}
            <Typography
              variant="h2"
              sx={{ fontWeight: "bold" }}
              className="glow-title"
            >
              Talk to a Folder
            </Typography>
            {/* One-liner description */}
            <Typography
              variant="h6"
              sx={{
                color: '#b3e5fc',
                fontWeight: 400,
                letterSpacing: 0.5,
                textShadow: '0 2px 8px rgba(79,195,247,0.18)',
                mb: 1.5, // closer to title
              }}
            >
              Instantly chat with the contents of any Google Drive folder.
            </Typography>
            {/* Login button with ripple effect */}
            <Button
              variant="outlined"
              size="large"
              onClick={getAuthUrl}
              className="cool-login-btn glow-btn"
              sx={{
                mt: 5, // further from one-liner
                paddingX: 4,
                paddingY: 1.5,
                fontSize: "1.1rem",
                backgroundColor: "transparent",
              }}
            >
              Get Started
            </Button>
            {error && (
              <Typography sx={{ color: '#ff5252', mt: 3, fontWeight: 500 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default Landing;
