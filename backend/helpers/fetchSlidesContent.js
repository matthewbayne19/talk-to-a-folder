// fetchSlidesContent.js
// Helper for extracting text content from a Google Slides presentation.

const { google } = require("googleapis");
const getAuthClient = require("./authClient");

// Fetches and returns the plain text content of a Google Slides presentation
const fetchSlidesContent = async (fileId, accessToken) => {
  const auth = getAuthClient(accessToken);
  const slides = google.slides({ version: "v1", auth });

  try {
    // Fetch all slides from the presentation
    const res = await slides.presentations.get({ presentationId: fileId });
    const slidesData = res.data.slides || [];

    // Extract text from each slide
    const content = slidesData
      .map((slide, idx) => {
        const textElements = [];
        slide.pageElements?.forEach((el) => {
          const shapes = el.shape?.text?.textElements || [];
          shapes.forEach((textEl) => {
            if (textEl.textRun?.content) {
              textElements.push(textEl.textRun.content);
            }
          });
        });
        return `Slide ${idx + 1}:\n${textElements.join("")}`;
      })
      .join("\n\n");

    return content.trim();
  } catch (err) {
    console.error("Failed to fetch Google Slides content:", err.message);
    return "[Error fetching Google Slides content]";
  }
};

module.exports = fetchSlidesContent;