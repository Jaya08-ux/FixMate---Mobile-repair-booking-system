const path = require("node:path");

module.exports = {
  outputFileTracingRoot: path.join(__dirname),
  // Keep dev output separate so it cannot mix with production build files.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};
