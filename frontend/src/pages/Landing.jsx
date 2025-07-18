import React from "react";
import axios from "axios";
import { Box, Button, Typography, Container } from "@mui/material";

function Landing() {
  const getAuthUrl = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auth-url");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Failed to get auth URL:", err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
          Talk to a Folder
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={getAuthUrl}
          sx={{
            mt: 4,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            paddingX: 4,
            paddingY: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Login with Google Drive
        </Button>
      </Container>
    </Box>
  );
}

export default Landing;
