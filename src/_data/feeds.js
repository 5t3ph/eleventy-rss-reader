// @link https://www.npmjs.com/package/feedparser
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
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
  return content.replace(/(<([^>]+)>)/gi, '').substr(0, content.lastIndexOf(' ', 200)).trim() + '...';
}

const parseFeed = async (feed) => {
  return await new Promise((resolve) => {
    const req = fetch(feed);

    const feedparser = new FeedParser();
    let feedItems = [];

    req.then(
      function (res) {
        if (res.status !== 200) {
          throw new Error('Bad status code');
        } else {
          // The response `body` -- res.body -- is a stream
          res.body.pipe(feedparser);
        }
      },
      function (_err) {
        // handle any request errors
      }
    );

    feedparser.on('error', function (_error) {
      // always handle errors
    });

    feedparser.on('readable', function () {
      let stream = this;
      let item;

      while ((item = stream.read())) {
        let feedItem = {};
        const itemTimestamp = new Date(item["date"]).getTime();

        if (itemTimestamp < dateLimit) {
          return;
        }

        // Process feedItem item and push it to items data if it exists
        if (item['title'] && item['date']) {
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

    feedparser.on('end', function () {
      resolve(feedItems);
    });
  }).catch(() => {
    return Promise.resolve([]);
  });
}

module.exports = async () => {
  const feedSources = await getSources();

  const feeds = [];
  for (const categorySource of feedSources) {
    const { category } = categorySource;
    const items = [];
    
    for (const feed of categorySource.items) {
      const feedData = await parseFeed(feed);
      if (feedData.length) {
        items.push({
          feedTitle: feedData[0].feedTitle,
          siteUrl: feedData[0].siteUrl,
          items: feedData,
        });
      }
    }

    feeds.push({ category, items });
  }

  return feeds;
}