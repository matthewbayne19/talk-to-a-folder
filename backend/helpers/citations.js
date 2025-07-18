// citations.js
// Helper for generating citation links for referenced files in assistant answers.

// Generates HTML links for files mentioned in the answer text
function generateCitations(answerText, files) {
  // Find files whose names are mentioned in the answer
  const mentioned = files.filter((file) =>
    answerText.toLowerCase().includes(file.name.toLowerCase())
  );

  if (mentioned.length === 0) return "";

  // Return comma-separated links to the files
  return mentioned
    .map((file) => `<a href="https://drive.google.com/file/d/${file.id}/view" target="_blank" rel="noopener noreferrer">${file.name}</a>`)
    .join(", ");
}

module.exports = {
  generateCitations,
};