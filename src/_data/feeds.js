// @link https://www.npmjs.com/package/feedparser
var FeedParser = require("feedparser");
var fetch = require("node-fetch");

module.exports = async () => {
  // TODO: Loop through all feed sources
  var req = fetch("https://css-tricks.com/author/stephanieeckles/feed/");
  var feedparser = new FeedParser();

  req.then(
    function (res) {
      if (res.status !== 200) {
        throw new Error("Bad status code");
      } else {
        // The response `body` -- res.body -- is a stream
        res.body.pipe(feedparser);
      }
    },
    function (err) {
      // handle any request errors
    }
  );

  feedparser.on("error", function (error) {
    // always handle errors
  });

  feedparser.on("readable", function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while ((item = stream.read())) {
      // TODO: Fix format of returned object
      return item;
    }
  });

}