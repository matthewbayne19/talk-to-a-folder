import React from "react";
import axios from "axios";

function Landing() {
  const getAuthUrl = async () => {
    const res = await axios.get("http://localhost:4000/auth-url");
    window.location.href = res.data.url;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Talk to a Folder</h1>
      <button onClick={getAuthUrl}>Login with Google Drive</button>
    </div>
  );
}

export default Landing;
