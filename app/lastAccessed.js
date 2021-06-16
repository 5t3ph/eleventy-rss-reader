require("dotenv").config();
const fs = require("fs");

const env = process.env.ELEVENTY_ENV;

const d = new Date();

// For local dev, set date back X days
if (env === 'dev') {
  // Range of your choosing
  d.setDate(d.getDate() - 60);
}

const time = new Date(d).getTime();

try {
  fs.writeFileSync("./src/_data/lastAccessed.js", `module.exports = ${time};`);
} catch (err) {
  console.error(err);
}
