const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const OpenAI = require("openai");
const axios = require("axios");
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/oauth-callback"
);

// Helper to create authenticated Google API client
const getAuthClient = (accessToken) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });
  return authClient;
};

// Step 1: Auth URL
app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
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

// Helper: Fetch Google Docs content
const fetchDocContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const docs = google.docs({ version: "v1", auth });

  const response = await docs.documents.get({ documentId: fileId });

  const bodyContent = response.data.body.content || [];
  const text = bodyContent
    .map((el) =>
      el.paragraph?.elements?.map((e) => e.textRun?.content).join("") || ""
    )
    .join("");

  return text;
};

// Helper: Fetch Google Sheets content
const fetchSheetContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const sheets = google.sheets({ version: "v4", auth });

  try {
    // Step 1: Get metadata to list all sheet names
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: fileId,
    });

    const sheetTitles = metadata.data.sheets?.map((s) => s.properties.title) || [];

    if (sheetTitles.length === 0) {
      return "[No sheets found]";
    }

    let fullContent = "";

    // Step 2: Loop through each sheet and fetch its data
    for (const title of sheetTitles) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range: title,
      });

      const rows = res.data.values || [];
      const sheetData = rows.map((row) => row.join(" | ")).join("\n");

      fullContent += `Sheet: ${title}\n${sheetData}\n\n`;
    }

    return fullContent.trim();
  } catch (err) {
    console.error(`Failed to fetch sheet content for ${fileId}:`, err.message);
    return "[Error fetching sheet content]";
  }
};

// Helper: Extract for PDF content
const fetchPdfContent = async (fileId, accessToken) => {
  try {
    // Export the file as PDF using Drive API
    const exportRes = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer", // important for binary
      }
    );

    const buffer = Buffer.from(exportRes.data);
    const parsed = await pdfParse(buffer);
    return parsed.text;
  } catch (err) {
    console.error(`Failed to parse PDF ${fileId}:`, err.message);
    return "[Error parsing PDF]";
  }
};

// Step 4: Get File Contents
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
