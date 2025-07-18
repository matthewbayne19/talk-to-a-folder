// authClient.js
// Helper for creating a Google OAuth2 client with a given access token.

const { google } = require("googleapis");

// Returns an OAuth2 client with the provided access token
const getAuthClient = (accessToken) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });
  return authClient;
};

module.exports = getAuthClient;