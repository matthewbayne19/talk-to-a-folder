const tmp = require("tmp");
const fs = require("fs");
const axios = require("axios");
const JSZip = require("jszip");
const xml2js = require("xml2js");

const fetchPptxContent = async (fileId, accessToken) => {
  try {
    // Download .pptx file as binary
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
      }
    );

    const zip = await JSZip.loadAsync(response.data);
    const slideFiles = Object.keys(zip.files).filter((name) =>
      name.match(/^ppt\/slides\/slide\d+\.xml$/)
    );

    const parser = new xml2js.Parser();
    const slides = [];

    for (const fileName of slideFiles) {
      const xml = await zip.file(fileName).async("string");
      const parsed = await parser.parseStringPromise(xml);

      // Traverse to extract text
      const textRuns =
        parsed["p:sld"]["p:cSld"]?.[0]["p:spTree"]?.[0]["p:sp"] || [];

      const slideText = textRuns
        .map((shape) =>
          shape["p:txBody"]?.[0]["a:p"]
            ?.map((p) =>
              p["a:r"]?.map((r) => r["a:t"]?.[0]).join("") || ""
            )
            .join("\n")
        )
        .filter(Boolean)
        .join("\n");

      slides.push(slideText);
    }

    return slides
      .map((text, i) => `Slide ${i + 1}:\n${text.trim()}`)
      .join("\n\n");
  } catch (err) {
    console.error(`Failed to read PowerPoint ${fileId}:`, err.message);
    return "[Error reading PowerPoint]";
  }
};

module.exports = fetchPptxContent;
