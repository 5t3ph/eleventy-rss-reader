![Preview of the Eleventy RSS Reader starter](https://repository-images.githubusercontent.com/373531262/91192f80-d222-11eb-8bcb-325ff3d0a3e7)

# Eleventy RSS Reader Starter

> We built most of this project LIVE over on Twitch. Visit the [announcement post](https://dev.to/5t3ph/let-s-build-a-jamstack-app-together-5hkp) to learn more.

This repo is now ready as an Eleventy starter! Review the recordings and customization section below to learn more about how it was built and how it works.

[Subscribe to my newsletter](https://moderncss.dev) to receive my weekly streaming schedule (and other news about my various projects + CSS tips).

[Follow @5t3ph on Twitter](https://twitter.com/5t3ph)

## Available Recordings

> Final edited recordings will eventually be published to the [11ty Rocks YouTube Channel](https://www.youtube.com/channel/UCTuSQg_Ol4shhSYQ1EfpHiQ?sub_confirmation=1)

- [Project intro and creating the feature list](https://youtu.be/ADx7RbtIWwg)
- [Begin the 11ty architecture + add feedparser](https://www.twitch.tv/videos/1044461360?collection=G7YXMEt6hhYCyw)
- [Reorganize, adjust feed output, and create dynamic views](https://www.twitch.tv/videos/1050950198?collection=G7YXMEt6hhYCyw)
- [Enable method to determine "new", link views](https://www.twitch.tv/videos/1052892091?collection=G7YXMEt6hhYCyw)
- [Filters and templating](https://www.twitch.tv/videos/1056940384?collection=G7YXMEt6hhYCyw)
- Part one of [CSS styling](https://www.twitch.tv/videos/1058997704?collection=G7YXMEt6hhYCyw)
- Part two of [CSS styling](https://www.twitch.tv/videos/1059018865?collection=G7YXMEt6hhYCyw)

> Note that additional styling and further organization was completed outside of the streams to get the starter fully release-ready. Check the commit history if you're interested in the difference between streamed dev and post-stream dev.

## Customization

### Site Title

Edit `src/_data/meta.js` to update the `siteTitle` value.

### Colors

Update the CSS custom properties values within `src/sass/_theme.scss` to quickly retheme the app.

### RSS Sources

Modify, add, or remove the JSON files within `src/feeds/` following the schema of:

```json
{
  "category": "Category Name",
  "items": ["https://permalink.to/feed"]
}
```

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass changes

**`npm run build`**

> Production build includes minified, autoprefixed CSS

Use this as the "Publish command" if needed by hosting such as Netlify.

## Resources to extend this and learn 11ty

**New to Eleventy?** Get started with my [written tutorial for beginners](https://11ty.rocks/posts/create-your-first-basic-11ty-website/)

**Learn to build an 11ty site in 20 mins** with my [egghead video course](https://5t3ph.dev/learn-11ty) and see how to add a blog and custom data.

**Explore advanced setup of custom data** through my [tutorial on building a community site](https://css-tricks.com/a-community-driven-site-with-eleventy-building-the-site/)

**Even more resources** are available from [11ty.Rocks](https://11ty.rocks)
