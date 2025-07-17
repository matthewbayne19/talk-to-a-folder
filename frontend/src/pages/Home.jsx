import React, { useState } from "react";
import axios from "axios";

const extractFolderId = (url) => {
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return folderMatch ? folderMatch[1] : null;
};

function Home() {
  const [folderUrl, setFolderUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const accessToken = localStorage.getItem("access_token");
    const folderId = extractFolderId(folderUrl);

    if (!folderId) {
      setError("Invalid Google Drive folder URL.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/list-files", {
        accessToken,
        folderUrl,
      });
      setFiles(res.data.files);
    } catch (err) {
      console.error("Error listing files:", err);
      setError("Failed to load files from Google Drive.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>You're authenticated!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste Google Drive folder URL here"
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
          style={{ width: "80%", padding: "8px", margin: "10px 0" }}
        />
        <button type="submit">Fetch Files</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {files.length > 0 && (
        <div>
          <h3>Files in Folder:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} ({file.mimeType})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
