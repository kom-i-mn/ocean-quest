/** @type {import('next').NextConfig} */
const nextConfig = {
  // PDF font files are read from disk at runtime; make sure Vercel bundles them.
  outputFileTracingIncludes: {
    "/api/diagnosis-report": ["./assets/fonts/**"],
  },
  // Don't advertise "X-Powered-By: Next.js" — reduces easy version fingerprinting.
  poweredByHeader: false,
};

export default nextConfig;
