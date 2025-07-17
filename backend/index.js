const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/oauth-callback"
);

app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  res.send({ url });
});

app.post("/auth-code", async (req, res) => {
  const { code } = req.body;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.send(tokens);
  } catch (err) {
    res.status(500).send("Failed to get tokens");
  }
});

const extractFolderId = (url) => {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

app.post("/list-files", async (req, res) => {
  const { accessToken, folderUrl } = req.body;

  const folderId = extractFolderId(folderUrl);
  if (!folderId) {
    return res.status(400).send("Invalid Google Drive folder URL.");
  }

  console.log("Parsed folderId:", folderId);
  console.log("Received accessToken:", accessToken?.slice(0, 10), "...");

  try {
    const driveRes = await axios.get(
      "https://www.googleapis.com/drive/v3/files",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `'${folderId}' in parents and trashed = false`,
          fields: "files(id, name, mimeType)",
        },
      }
    );

    res.send({ files: driveRes.data.files });
  } catch (err) {
    console.error("Error fetching files:", err.response?.data || err.message);
    res.status(500).send("Failed to list files");
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
