// fetchTxtContent.js
// Helper for extracting text content from a plain text file.

const axios = require("axios");

// Fetches and returns the plain text content of a TXT file
const fetchTxtContent = async (fileId, accessToken) => {
  try {
    // Download TXT file from Google Drive
    const res = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "text",
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Failed to read TXT file ${fileId}:`, err.message);
    return "[Error reading TXT file]";
  }
};

module.exports = fetchTxtContent;
