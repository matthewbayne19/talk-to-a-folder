const axios = require("axios");
const pdfParse = require("pdf-parse");

const fetchPdfContent = async (fileId, accessToken) => {
  try {
    const exportRes = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
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

module.exports = fetchPdfContent;