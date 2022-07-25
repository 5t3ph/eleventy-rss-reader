// @link https://www.npmjs.com/package/feedparser
const FeedParser = require("feedparser");
const { Readable } = require('stream');
const EleventyFetch = require("@11ty/eleventy-fetch");
const fastglob = require("fast-glob");
const fs = require("fs");
const lastAccessed = require("./lastAccessed.js");
const dateLimit = require("./dateLimit.js");

const getSources = async () => {
  // Create a "glob" of all feed json files
  const feedFiles = await fastglob("./src/feeds/*.json", {
    caseSensitiveMatch: false,
  });

  // Loop through those files and add their content to our `feeds` Set
  let feeds = [];
  for (let feed of feedFiles) {
    const feedData = JSON.parse(fs.readFileSync(feed));
    feeds.push(feedData);
  }

  // Return the feeds Set of objects within an array
  return feeds;
};

const createExcerpt = (content) => {
  return (
    content
      .replace(/(<([^>]+)>)/gi, "")
      .substr(0, content.lastIndexOf(" ", 200))
      .trim() + "..."
  );
};

const parseFeed = async (feed, category) => {
  return await new Promise((resolve) => {
    // retrieve data (if not in the cache)
    const req = EleventyFetch(feed, {
      duration: "1d", // cache data for 1 day
      type: "buffer",
      verbose: true   // check output for caching message after expiration
    });

    const feedparser = new FeedParser();
    let feedItems = [];

    req.then(
      function (res) {
        // convert buffer to readable stream for compatibility with
        // feedparser package
        Readable.from(res).pipe(feedparser);
      }
    ).catch(e => {
      console.log(e);
      throw new Error(`Could not retrieve ${feed}`);
    });

    feedparser.on("error", function (_error) {
      // always handle errors
    });

    feedparser.on("readable", function () {
      let stream = this;
      let item;

      while ((item = stream.read())) {
        let feedItem = { category };
        const itemTimestamp = new Date(item["date"]).getTime();

        if (itemTimestamp < dateLimit) {
          return;
        }

        // Process feedItem item and push it to items data if it exists
        if (item["title"] && item["date"]) {
          // Feed Source meta data
          feedItem["feedTitle"] = item["meta"].title;
          feedItem["feedAuthor"] = item["meta"].author || item["author"];
          feedItem["siteUrl"] = item["meta"].link;
          feedItem["feedUrl"] = item["meta"].xmlurl;

          // Check freshness
          if (itemTimestamp > lastAccessed) {
            feedItem["new"] = "true";
          }

          // Individual item data
          feedItem["title"] = item["title"];
          feedItem["date"] = item["date"];

          if (item["summary"]) {
            feedItem["excerpt"] = createExcerpt(item["summary"]);
          } else if (item["description"]) {
            feedItem["excerpt"] = createExcerpt(item["description"]);
          }

          if (item["description"]) {
            feedItem["content"] = item["description"];
          }

          if (item["link"]) {
            feedItem["link"] = item["link"];
          }

          if (item["image"] && item["image"].url) {
            feedItem["imageUrl"] = item["image"].url;
          }

          feedItems.push(feedItem);
        }
      }
    });

    feedparser.on("end", function () {
      resolve(feedItems);
    });
  }).catch(() => {
    return Promise.resolve([]);
  });
};

module.exports = async () => {
  const feedSources = await getSources();

  const feeds = [];
  for (const categorySource of feedSources) {
    const { category } = categorySource;
    const items = [];

    for (const feed of categorySource.items) {
      const feedData = await parseFeed(feed, category);
      if (feedData.length) {
        items.push({
          feedTitle: feedData[0].feedTitle,
          siteUrl: feedData[0].siteUrl,
          category,
          items: feedData,
        });
      }
    }

    feeds.push({ category, items });
  }

  return feeds;
};
