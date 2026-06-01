#!/usr/bin/env node
/**
 * Tracking-Smoke-Test fuer alle zZzlim-Landingpages.
 *
 * Prueft pro Domain:
 *   1. Seite laedt (HTTP 200)
 *   2. scripts/tracking.js ist eingebunden
 *   3. tracking.js ist die VOLLE Version (element_click vorhanden)
 *   4. /api/track-Rewrite antwortet 200 (Beacon-Ziel erreichbar)
 *   5. lp_view-Beacon wird angenommen (echter POST, anonym, danach geloescht-Marker)
 *
 * Lokal:  node scripts/tracking-smoke-test.mjs
 * CI:     exit code 1 wenn IRGENDEINE aktive LP rot ist.
 *
 * Neue LP? Einfach unten in LPS eintragen ODER --domains uebergeben:
 *   node scripts/tracking-smoke-test.mjs --domains neuelp.zzzlim.de,andere.zzzlim.de
 */

const DEFAULT_LPS = [
  "rettet.zzzlim.de",
  "k2.zzzlim.de",
];

const arg = process.argv.find((a) => a.startsWith("--domains="));
const LPS = arg ? arg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_LPS;

const cb = () => `?cb=${Math.random().toString(36).slice(2)}`;

async function check(domain) {
  const out = { domain, ok: false, page: 0, hasScript: false, fullSdk: false, apiTrack: 0, beacon: 0, notes: [] };
  try {
    const pageRes = await fetch(`https://${domain}/${cb()}`, { redirect: "manual" });
    out.page = pageRes.status;
    if (pageRes.status >= 300 && pageRes.status < 400) { out.notes.push(`redirect -> ${pageRes.headers.get("location")}`); return out; }
    const html = await pageRes.text();
    out.hasScript = /scripts\/tracking\.js/.test(html);

    const sdkRes = await fetch(`https://${domain}/scripts/tracking.js${cb()}`);
    const sdk = sdkRes.ok ? await sdkRes.text() : "";
    out.fullSdk = /element_click/.test(sdk);

    const apiRes = await fetch(`https://${domain}/api/track`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: `https://${domain}` },
      body: JSON.stringify({ event: "smoke_ping", lp_id: "smoke-test" }),
    });
    out.apiTrack = apiRes.status;

    // Echter lp_view-Beacon (anonym, consent=none). Markiert als smoke-test -> leicht filterbar.
    const beaconRes = await fetch(`https://${domain}/api/track`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: `https://${domain}` },
      body: JSON.stringify({ event: "lp_view", lp_id: "smoke-test", session_id: `SMOKE-${Date.now()}`, consent: "none", page: "/smoke" }),
    });
    out.beacon = beaconRes.status;

    out.ok = out.page === 200 && out.hasScript && out.fullSdk && out.apiTrack === 200 && out.beacon === 200;
    if (!out.hasScript) out.notes.push("tracking.js NICHT eingebunden");
    if (!out.fullSdk) out.notes.push("SDK veraltet (kein element_click)");
    if (out.apiTrack !== 200) out.notes.push(`/api/track = ${out.apiTrack}`);
  } catch (e) {
    out.notes.push("EXC " + String(e).slice(0, 80));
  }
  return out;
}

const results = await Promise.all(LPS.map(check));
let red = 0;
console.log("\nLP-TRACKING SMOKE-TEST\n" + "=".repeat(58));
for (const r of results) {
  const tag = r.ok ? "✅ OK  " : "❌ FAIL";
  console.log(`${tag} ${r.domain.padEnd(24)} page=${r.page} script=${r.hasScript ? "y" : "n"} sdk=${r.fullSdk ? "full" : "old"} api=${r.apiTrack} beacon=${r.beacon}`);
  if (r.notes.length) console.log("        " + r.notes.join(" | "));
  if (!r.ok) red++;
}
console.log("=".repeat(58));
console.log(red === 0 ? `Alle ${results.length} LPs gruen.\n` : `${red}/${results.length} LP(s) ROT.\n`);
process.exit(red === 0 ? 0 : 1);
