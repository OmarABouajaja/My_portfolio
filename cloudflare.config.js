module.exports = {
  // Build configuration
  build: {
    command: "npm run build",
    directory: "dist",
    environment: {
      NODE_VERSION: "18"
    }
  },

  // Custom headers
  headers: {
    "/*": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.cloudflare.com; font-src 'self' data:; connect-src 'self' *.cloudflare.com;"
    }
  },

  // Redirects
  redirects: [
    {
      source: "/home",
      destination: "/",
      permanent: true
    }
  ],

  // Custom 404 page
  notFoundPage: "404.html",

  // Cache configuration
  cache: {
    patterns: [
      {
        regexp: "\\.(jpg|jpeg|gif|png|ico|svg)$",
        maxAge: "1y"
      },
      {
        regexp: "\\.(js|css|pdf)$",
        maxAge: "1y"
      }
    ]
  }
}; 