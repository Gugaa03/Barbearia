/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pixabay.com', 'images.unsplash.com','pin.it'], // adiciona aqui os domínios que vai usar
  },
};

module.exports = nextConfig;
