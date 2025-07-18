// fetchWordContent.js
// Helper for extracting text content from a Microsoft Word (.docx) file using mammoth.

const mammoth = require("mammoth");
const fetchBinaryFile = require("./fetchBinaryFile");

// Fetches and returns the plain text content of a Word document
const fetchWordContent = async (fileId, accessToken) => {
  try {
    // Download the Word file as a binary
    const filePath = await fetchBinaryFile(fileId, accessToken);
    // Extract raw text from the Word file
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (err) {
    console.error(`Failed to read Word doc ${fileId}:`, err.message);
    return "[Error reading Word doc]";
  }
};

module.exports = fetchWordContent;