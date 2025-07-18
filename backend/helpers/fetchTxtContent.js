const axios = require("axios");

const fetchTxtContent = async (fileId, accessToken) => {
  try {
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
