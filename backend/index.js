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

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/oauth-callback"
);

app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly"
    ]
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

// List files in folder
app.post("/list-files", async (req, res) => {
  const { accessToken, folderId } = req.body;
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth: authClient });

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

// Helper functions to fetch content
const fetchDocContent = async (fileId, accessToken) => {
  const response = await axios.get(
    `https://docs.googleapis.com/v1/documents/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const bodyContent = response.data.body.content || [];
  const text = bodyContent
    .map((el) => el.paragraph?.elements?.map((e) => e.textRun?.content).join("") || "")
    .join("");
  return text;
};

const fetchSheetContent = async (fileId, accessToken) => {
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/Sheet1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.values.map((row) => row.join(" | ")).join("\n");
};

const fetchPdfContent = async (fileId, accessToken) => {
  // Placeholder for PDF handling — would require file export and PDF parsing
  return "[PDF content parsing not implemented]";
};

// Get file contents
app.post("/get-file-contents", async (req, res) => {
  const { accessToken, files } = req.body;

  const fileContents = [];

  for (const file of files) {
    let content = "";

    try {
      if (file.mimeType === "application/vnd.google-apps.document") {
        content = await fetchDocContent(file.id, accessToken);
      } else if (file.mimeType === "application/vnd.google-apps.spreadsheet") {
        content = await fetchSheetContent(file.id, accessToken);
      } else if (file.mimeType === "application/pdf") {
        content = await fetchPdfContent(file.id, accessToken);
      } else {
        content = "[Unsupported file type]";
      }
    } catch (err) {
      console.error(`Failed to fetch content for ${file.name}:`, err.message);
      content = "[Error fetching file content]";
    }

    fileContents.push({ name: file.name, content });
  }

  res.send({ contents: fileContents });
});

// Chat agent
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
