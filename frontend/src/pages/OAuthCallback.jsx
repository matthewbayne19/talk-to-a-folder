import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        try {
          const res = await axios.post("http://localhost:4000/auth-code", { code });
          localStorage.setItem("access_token", res.data.access_token);
          navigate("/home");
        } catch {
          alert("Authentication failed.");
        }
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <CircularProgress sx={{ color: "#fff" }} />
    </Box>
  );
}

export default OAuthCallback;
