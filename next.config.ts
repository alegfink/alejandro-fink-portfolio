import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://region1.google-analytics.com",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    globalNotFound: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/proyectos/:slug", destination: "/proyectos#:slug", permanent: true },
      { source: "/es/proyectos", destination: "/proyectos", permanent: true },
      { source: "/es/sobre-mi", destination: "/acerca-de", permanent: true },
      { source: "/es/privacidad", destination: "/privacidad", permanent: true },
      { source: "/es/contacto", destination: "/acerca-de", permanent: true },
      { source: "/en/work/:slug", destination: "/en/projects#:slug", permanent: true },
      { source: "/en/work", destination: "/en/projects", permanent: true },
      { source: "/en/contact", destination: "/en/about", permanent: true },
      { source: "/v2", destination: "/", permanent: true },
      { source: "/v2/proyectos", destination: "/proyectos", permanent: true },
      { source: "/v2/acerca-de", destination: "/acerca-de", permanent: true },
      { source: "/v2/en", destination: "/en", permanent: true },
      { source: "/v2/en/projects", destination: "/en/projects", permanent: true },
      { source: "/v2/en/about", destination: "/en/about", permanent: true },
      { source: "/v2/heroes", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
