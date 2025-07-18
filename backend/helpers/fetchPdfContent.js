// fetchPdfContent.js
// Helper for extracting text content from a PDF file using pdf-parse.

const axios = require("axios");
const pdfParse = require("pdf-parse");

// Fetches and returns the plain text content of a PDF file
const fetchPdfContent = async (fileId, accessToken) => {
  try {
    // Download PDF file from Google Drive
    const exportRes = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
      }
    );

    // Parse PDF buffer to extract text
    const buffer = Buffer.from(exportRes.data);
    const parsed = await pdfParse(buffer);
    return parsed.text;
  } catch (err) {
    console.error(`Failed to parse PDF ${fileId}:`, err.message);
    return "[Error parsing PDF]";
  }
};

module.exports = fetchPdfContent;