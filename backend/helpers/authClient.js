const { google } = require("googleapis");

const getAuthClient = (accessToken) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });
  return authClient;
};

module.exports = getAuthClient;