const { google } = require("googleapis");
const getAuthClient = require("./authClient");

const fetchDocContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const docs = google.docs({ version: "v1", auth });

  const response = await docs.documents.get({ documentId: fileId });
  const bodyContent = response.data.body.content || [];
  const text = bodyContent
    .map((el) =>
      el.paragraph?.elements?.map((e) => e.textRun?.content).join("") || ""
    )
    .join("");

  return text;
};

module.exports = fetchDocContent;