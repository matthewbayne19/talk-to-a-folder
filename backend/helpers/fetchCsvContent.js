const axios = require("axios");
const tmp = require("tmp");
const fs = require("fs");

const fetchCsvContent = async (fileId, accessToken) => {
  try {
    const tmpFile = tmp.fileSync({ postfix: ".csv" });
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    const writer = fs.createWriteStream(tmpFile.name);

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

    const content = fs.readFileSync(tmpFile.name, "utf8");
    return content;
  } catch (err) {
    console.error(`Failed to read CSV file ${fileId}:`, err.message);
    return "[Error reading CSV file]";
  }
};

module.exports = fetchCsvContent;
