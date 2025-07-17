import React, { useState } from "react";
import axios from "axios";

function App() {
  const [authUrl, setAuthUrl] = useState("");

  const getAuthUrl = async () => {
    const res = await axios.get("http://localhost:4000/auth-url");
    window.location.href = res.data.url;
  };

  return (
    <div>
      <h1>Talk to a Folder</h1>
      <button onClick={getAuthUrl}>Login with Google Drive</button>
    </div>
  );
}

export default App;
