import React from "react";
import axios from "axios";
import { Box, Button, Typography, Container } from "@mui/material";

function Landing() {
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

    // Original login logic
    try {
      const res = await axios.get("http://localhost:4000/auth-url");
      window.location.href = res.data.url;
    } catch (err) {
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
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
            className="glow-title"
          >
            Talk to a Folder
          </Typography>

          <Button
            variant="outlined"
            size="large"
            onClick={getAuthUrl}
            className="cool-login-btn"
            sx={{
              mt: 4,
              paddingX: 4,
              paddingY: 1.5,
              fontSize: "1.1rem",
              backgroundColor: "transparent",
            }}
          >
            Login with Google Drive
          </Button>
        </Container>
      </Box>
    </div>
  );
}

export default Landing;
