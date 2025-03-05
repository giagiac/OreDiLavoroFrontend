/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: false,
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
};

module.exports = nextConfig;
