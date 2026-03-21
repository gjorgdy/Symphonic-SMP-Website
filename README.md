# Symphonic SMP Website

The Symphonic SMP is a music inspired Minecraft server with a lot of great smaller creators created by [Mypigisawesome](https://www.youtube.com/channel/UCcVXBFM1JNvmCDai6ggbx1w) and [SkyLimit](https://www.youtube.com/@SkyLimit17).
I started watching it after getting contacted by one of the members regarding a Minecraft mod I made.

Looking for a side project to do after working on Minecraft mods for weeks, I decided to make a website for the server.

## The website itself

The website is built primarily using [Svelte](https://svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/) running on [Bun](https://bun.sh/).

To get videos and livestream (content) it calls the YouTube Data API and Twitch API respectively.
Some simple caching logic is implemented to avoid hitting the API limits. When a user visits the website, 
it checks if the content is cached and if it's not too old. If it is, it fetches new content from the APIs and updates the cache.

## Hosting

The website is currently hosted on a personal [Hetzner](https://www.hetzner.com/) VPS using Docker.
With a domain provided by Mypigisawesome, the website is accessible at [symphonicsmp.net](https://symphonicsmp.net/).

## Development and Contribution

In case you want to contribute or run the website locally, you can do so by following the instructions below.

Make sure you have Bun installed on your machine, and know how to use Git.

To start of clone the repository and install the dependencies using Bun:

```bash
bun install
```

Before running the website, you need to set up the environment variables for the YouTube Data API and Twitch API.
You can copy the `.env.example` file, rename it `.env` and fill in the required values.

To start the development server, run the following command:

```bash
bun run dev
```

## License

This project is licensed under the CC0 1.0 Universal License - see the [LICENSE](LICENSE) file for details.

This basically means that you can do whatever you want with the code, without any restrictions. 
You can use it for personal or commercial projects, modify it, distribute it, etc.

It's just a hobby project after all, and I want to make it as accessible as possible for anyone who might find it useful or interesting.