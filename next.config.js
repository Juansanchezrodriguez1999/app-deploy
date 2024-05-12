const withPWA = require("next-pwa");
const runtimeCaching = require("./cache.js");

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'en-US',
  },
  images: {
    domains: ['ui-avatars.com'],
  },
  pwa: {
    dest: "public",
    runtimeCaching,
    register: true,
    skipWaiting: true,
  }
});