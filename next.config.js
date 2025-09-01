/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Removed trailingSlash so static export creates review.html etc., allowing /review without redirect
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
