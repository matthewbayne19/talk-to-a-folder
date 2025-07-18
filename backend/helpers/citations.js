function generateCitations(answerText, files) {
  const mentioned = files.filter((file) =>
    answerText.toLowerCase().includes(file.name.toLowerCase())
  );

  if (mentioned.length === 0) return "";

  return mentioned
    .map((file) => `${file.name}`)
    .join(", ");
}

module.exports = {
  generateCitations,
};