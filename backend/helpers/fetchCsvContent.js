// fetchCsvContent.js
// Helper for extracting text content from a CSV file.

const axios = require("axios");
const tmp = require("tmp");
const fs = require("fs");

// Fetches and returns the plain text content of a CSV file
const fetchCsvContent = async (fileId, accessToken) => {
  try {
    // Create a temporary file for the CSV
    const tmpFile = tmp.fileSync({ postfix: ".csv" });
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    const writer = fs.createWriteStream(tmpFile.name);

    // Download CSV file as a stream
    await axios({
      method: "get",
      url,
      responseType: "stream",
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((res) =>
      new Promise((resolve, reject) => {
        res.data.pipe(writer);
        res.data.on("end", resolve);
        res.data.on("error", reject);
      })
    );

    // Read the downloaded CSV file
    const content = fs.readFileSync(tmpFile.name, "utf8");
    return content;
  } catch (err) {
    console.error(`Failed to read CSV file ${fileId}:`, err.message);
    return "[Error reading CSV file]";
  }
};

module.exports = fetchCsvContent;
