const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
