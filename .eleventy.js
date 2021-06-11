const { DateTime } = require("luxon");
const lastAccessed = require("./src/_data/lastAccessed.js") || Date.now();

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("newCount", (feedItems) => {
    return feedItems.filter(
      (i) => new Date(`${i.date}`).getTime() > new Date(lastAccessed).getTime()
    );
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
