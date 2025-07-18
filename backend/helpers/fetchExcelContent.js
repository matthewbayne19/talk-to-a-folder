// fetchExcelContent.js
// Helper for extracting text content from a Microsoft Excel (.xlsx) file using xlsx.

const axios = require("axios");
const xlsx = require("xlsx");

// Fetches and returns the plain text content of an Excel file
const fetchExcelContent = async (fileId, accessToken) => {
  try {
    // Download Excel file from Google Drive
    const res = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
      }
    );

    // Parse Excel buffer to extract sheet data
    const workbook = xlsx.read(res.data, { type: "buffer" });
    const sheetNames = workbook.SheetNames;

    let content = "";
    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = xlsx.utils.sheet_to_csv(sheet);
      content += `Sheet: ${sheetName}\n${csv}\n\n`;
    }

    return content.trim();
  } catch (err) {
    console.error(`Failed to read Excel file ${fileId}:`, err.message);
    return "[Error reading Excel file]";
  }
};

module.exports = fetchExcelContent;