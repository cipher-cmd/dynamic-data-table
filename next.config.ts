import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Ignore fs-related modules on client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        querystring: false,
        url: false,
        http: false,
        https: false,
        os: false,
        assert: false,
        constants: false,
        timers: false,
        console: false,
        vm: false,
        zlib: false,
        process: false,
      };
    }

    // Ignore specific problematic modules
    config.externals = config.externals || [];
    config.externals.push({
      '@nodelib/fs.scandir': 'commonjs @nodelib/fs.scandir',
      '@nodelib/fs.stat': 'commonjs @nodelib/fs.stat',
      '@nodelib/fs.walk': 'commonjs @nodelib/fs.walk',
    });

    return config;
  },
};

export default nextConfig;
