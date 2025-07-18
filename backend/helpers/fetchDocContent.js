// fetchDocContent.js
// Helper for extracting text content from a Google Doc file.

const { google } = require("googleapis");
const getAuthClient = require("./authClient");

// Fetches and returns the plain text content of a Google Doc
const fetchDocContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const docs = google.docs({ version: "v1", auth });

  // Fetch document content from Google Docs API
  const response = await docs.documents.get({ documentId: fileId });
  const bodyContent = response.data.body.content || [];
  // Extract and join all text runs
  const text = bodyContent
    .map((el) =>
      el.paragraph?.elements?.map((e) => e.textRun?.content).join("") || ""
    )
    .join("");

  return text;
};

module.exports = fetchDocContent;