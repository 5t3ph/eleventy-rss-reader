const { DateTime } = require("luxon");
const slugify = require("slugify");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addShortcode("newCount", (items, source, slug) => {
    const newItems = items.filter((i) => {
      return i.data.source === source && i.data.new === "true";
    });

    return newItems.length > 0
      ? `<span aria-describedby="${slug}">${newItems.length}<span class="inclusively-hidden"> new items</span></span>`
      : "";
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("domain", function (url) {
    const domain = new URL(url);

    return domain.hostname.replace("www.", "");
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
