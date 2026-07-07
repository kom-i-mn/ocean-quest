/** @type {import('next').NextConfig} */
const nextConfig = {
  // PDF font files are read from disk at runtime; make sure Vercel bundles them.
  outputFileTracingIncludes: {
    "/api/diagnosis-report": ["./assets/fonts/**"],
  },
};

export default nextConfig;
