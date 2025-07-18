const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const OpenAI = require("openai");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import helpers
const getAuthClient = require("./helpers/authClient");
const fetchDocContent = require("./helpers/fetchDocContent");
const fetchSheetContent = require("./helpers/fetchSheetContent");
const fetchPdfContent = require("./helpers/fetchPdfContent");
const fetchSlidesContent = require("./helpers/fetchSlidesContent");
const fetchWordContent = require("./helpers/fetchWordContent");
const fetchExcelContent = require("./helpers/fetchExcelContent");
const fetchPptxContent = require("./helpers/fetchPptxContent");
const fetchTxtContent = require("./helpers/fetchTxtContent");
const fetchCsvContent = require("./helpers/fetchCsvContent");


// OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/oauth-callback"
);

// Step 1: Auth URL
app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/presentations.readonly",
    ],
  });
  res.send({ url });
});

// Step 2: Auth Code Exchange
app.post("/auth-code", async (req, res) => {
  const { code } = req.body;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.send(tokens);
  } catch (err) {
    res.status(500).send("Failed to get tokens");
  }
});

// Step 3: List Files
app.post("/list-files", async (req, res) => {
  const { accessToken, folderId } = req.body;

  const auth = getAuthClient(accessToken);
  const drive = google.drive({ version: "v3", auth });

  try {
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType)",
    });

    const files = listRes.data.files || [];
    res.send({ files });
  } catch (err) {
    console.error("Error listing files:", err.response?.data || err.message);
    res.status(500).send("Failed to list files");
  }
});

// Step 4: Get File Contents
app.post("/get-file-contents", async (req, res) => {
  const { accessToken, files } = req.body;
  const fileContents = [];

  for (const file of files) {
    let content = "";

    try {
      switch (file.mimeType) {
        case "application/vnd.google-apps.document":
          content = await fetchDocContent(file.id, accessToken);
          break;
        case "application/vnd.google-apps.spreadsheet":
          content = await fetchSheetContent(file.id, accessToken);
          break;
        case "application/pdf":
          content = await fetchPdfContent(file.id, accessToken);
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          content = await fetchWordContent(file.id, accessToken);
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          content = await fetchExcelContent(file.id, accessToken);
          break;
        case "application/vnd.google-apps.presentation":
          content = await fetchSlidesContent(file.id, accessToken);
          break;
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          content = await fetchPptxContent(file.id, accessToken);
          break;
        case "text/plain":
          content = await fetchTxtContent(file.id, accessToken);
          break;
        case "text/csv":
          content = await fetchCsvContent(file.id, accessToken);
          break;
        default:
          content = "[Unsupported file type]";
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) return res.status(401).send("Access token expired");
      console.error(`Failed to fetch content for ${file.name}:`, err.message);
      content = "[Error fetching file content]";
    }

    fileContents.push({ name: file.name, content });
  }

  res.send({ contents: fileContents });
});

// Step 5: Ask OpenAI Agent
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ask-agent", async (req, res) => {
  const { contents, question } = req.body;

  if (!Array.isArray(contents)) {
    return res.status(400).send("Missing or invalid 'contents'");
  }

  const combined = contents
    .map((file) => `File: ${file.name}\nContent:\n${file.content}\n`)
    .join("\n\n");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. You answer user questions using the following file contents:",
        },
        {
          role: "user",
          content: `Here is the folder's file content:\n\n${combined}\n\nQuestion: ${question}`,
        },
      ],
    });

    res.send({ answer: response.choices[0].message.content });
  } catch (err) {
    console.error("Error calling OpenAI:", err.message);
    res.status(500).send("Failed to generate answer");
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
