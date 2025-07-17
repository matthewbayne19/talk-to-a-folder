import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  return <p>Loading...</p>;
}

export default OAuthCallback;
