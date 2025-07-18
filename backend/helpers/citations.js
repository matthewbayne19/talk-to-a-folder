function generateCitations(answerText, files) {
  const mentioned = files.filter((file) =>
    answerText.toLowerCase().includes(file.name.toLowerCase())
  );

  if (mentioned.length === 0) return "";

  return mentioned
    .map((file) => `<a href="https://drive.google.com/file/d/${file.id}/view" target="_blank" rel="noopener noreferrer">${file.name}</a>`)
    .join(", ");
}

module.exports = {
  generateCitations,
};