const { google } = require("googleapis");
const getAuthClient = require("./authClient");

const fetchSheetContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: fileId });
    const sheetTitles = metadata.data.sheets?.map((s) => s.properties.title) || [];

    if (sheetTitles.length === 0) return "[No sheets found]";

    let fullContent = "";
    for (const title of sheetTitles) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range: title,
      });
      const rows = res.data.values || [];
      const sheetData = rows.map((row) => row.join(" | ")).join("\n");
      fullContent += `Sheet: ${title}\n${sheetData}\n\n`;
    }

    return fullContent.trim();
  } catch (err) {
    console.error(`Failed to fetch sheet content for ${fileId}:`, err.message);
    return "[Error fetching sheet content]";
  }
};

module.exports = fetchSheetContent;