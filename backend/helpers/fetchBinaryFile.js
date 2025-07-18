const axios = require("axios");
const tmp = require("tmp");
const fs = require("fs");

const fetchBinaryFile = async (fileId, accessToken) => {
  const tmpFile = tmp.fileSync();
  const dest = fs.createWriteStream(tmpFile.name);
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  await axios({
    method: "get",
    url,
    responseType: "stream",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => new Promise((resolve, reject) => {
    res.data.pipe(dest);
    res.data.on("end", resolve);
    res.data.on("error", reject);
  }));

  return tmpFile.name;
};

module.exports = fetchBinaryFile;