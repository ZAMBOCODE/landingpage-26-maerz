// Edge Middleware: host-based routing for multi-LP architecture.
// rettet.zzzlim.de/<html-route> -> serves /rettet/<html-route>
// Asset requests (anything with a file extension) fall through to the repo root
// because rettet/index.html uses <base href="../"> and shares /media, /erklaer.css etc.

export const config = {
  matcher: ['/((?!_vercel|api/).*)'],
};

const HOST_TO_PREFIX = {
  'rettet.zzzlim.de': '/rettet',
  'energie.zzzlim.de': '/energie',
  'check.zzzlim.de': '/check',
};

const ASSET_EXTENSION = /\.[a-z0-9]{2,5}(\?.*)?$/i;

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.hostname).toLowerCase();
  const prefix = HOST_TO_PREFIX[host];
  if (!prefix) return;
  if (url.pathname.startsWith(prefix + '/') || url.pathname === prefix) return;
  if (ASSET_EXTENSION.test(url.pathname)) return; // shared assets stay at root
  const newUrl = new URL(request.url);
  newUrl.pathname = prefix + (url.pathname === '/' ? '/' : url.pathname);
  return new Response(null, {
    status: 200,
    headers: { 'x-middleware-rewrite': newUrl.toString() },
  });
}
