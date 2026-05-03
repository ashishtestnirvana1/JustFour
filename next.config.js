/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@supabase/ssr'],
  allowedDevOrigins: ['192.168.0.30'],
}

module.exports = nextConfig
