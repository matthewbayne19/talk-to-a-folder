const mammoth = require("mammoth");
const fetchBinaryFile = require("./fetchBinaryFile");

const fetchWordContent = async (fileId, accessToken) => {
  try {
    const filePath = await fetchBinaryFile(fileId, accessToken);
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (err) {
    console.error(`Failed to read Word doc ${fileId}:`, err.message);
    return "[Error reading Word doc]";
  }
};

module.exports = fetchWordContent;