/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  reactStrictMode: true,
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5328/api/:path*",
      },
    ];
  },
  */
  async headers() {
    return [
      {
        source: "/((?!api/).*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
