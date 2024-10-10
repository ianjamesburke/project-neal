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

  // Updated rewrites configuration
  async rewrites() {
    return [
      {
        source: '/flask/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'https://127.0.0.1:5328/flask/:path*'
            : '/flask/:path*',
      },
    ];
  },

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
