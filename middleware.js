// Edge Middleware: host-based routing for multi-LP architecture.
// rettet.zzzlim.de/<path> -> serves /rettet/<path>
// k2.zzzlim.de and Vercel preview URLs stay untouched.

export const config = {
  matcher: ['/((?!_vercel|api/).*)'],
};

const HOST_TO_PREFIX = {
  'rettet.zzzlim.de': '/rettet',
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.hostname;
  const prefix = HOST_TO_PREFIX[host];
  if (!prefix) return;
  if (url.pathname.startsWith(prefix + '/') || url.pathname === prefix) return;
  const newUrl = new URL(request.url);
  newUrl.pathname = prefix + (url.pathname === '/' ? '/' : url.pathname);
  return new Response(null, {
    status: 200,
    headers: { 'x-middleware-rewrite': newUrl.toString() },
  });
}
