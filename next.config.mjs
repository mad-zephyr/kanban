/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  images: {
    domains: ['unsplash.com'], // Add any external domains you use for images
  },
  reactStrictMode: false,
}

export default nextConfig
