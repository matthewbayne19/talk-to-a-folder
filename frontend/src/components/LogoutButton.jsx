import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Box } from "@mui/material";

const LogoutButton = ({ className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post("http://localhost:4000/logout", { accessToken });
    } catch (err) {
      console.error("Error revoking token:", err);
    } finally {
      localStorage.removeItem("access_token");
      navigate("/");
    }
  };

  return (
    <Box sx={{ position: "absolute", top: 20, right: 20 }}>
      <Button
        variant="outlined"
        onClick={handleLogout}
        className={className}
        sx={{
          color: "#fff",
          borderColor: "#fff",
          "&:hover": {
            backgroundColor: "#222",
            borderColor: "#ccc",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton;
