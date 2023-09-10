/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ENDPOINT1: process.env.ENDPOINT1,
    ENDPOINT2: process.env.ENDPOINT2,
  },
};

module.exports = nextConfig;
