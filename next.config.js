/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Resolver problemas com caracteres especiais no caminho
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Configuração adicional para resolver problemas de módulos
    config.module.rules.push({
      test: /\.js$/,
      resolve: {
        fullySpecified: false
      }
    });
    
    return config;
  },
  // Configurações para resolver problemas de caminho
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Configurações de desenvolvimento
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
