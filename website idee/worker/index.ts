/**
 * De Groene Weide — Worker.
 *
 * Alles onder /api gaat naar de JSON-API (D1 + e-mail). Al het andere wordt
 * door de static-assets-binding geserveerd, met SPA-fallback voor de routes.
 */
import { verwerk } from './api'

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return verwerk(request, env, ctx)
    }

    const response = await env.ASSETS.fetch(request)

    // Beveiligingskopjes voor de site zelf.
    const headers = new Headers(response.headers)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('X-Frame-Options', 'SAMEORIGIN')
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    )
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self'",
        "connect-src 'self'",
        "frame-src 'self'",
      ].join('; '),
    )
    if (url.pathname.startsWith('/assets/')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    ctx.waitUntil(Promise.resolve())
    return new Response(response.body, { status: response.status, headers })
  },
} satisfies ExportedHandler<Env>
