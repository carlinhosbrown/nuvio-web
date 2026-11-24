import { Platform } from "./index.js";

// In the browser build, the EngineFS streaming server runs next to the web
// server (scripts/serve.mjs) and is reached through the same origin under
// /engine, so torrents work from any device that can open the web app.
export const BROWSER_ENGINE_PATH = "/engine";
const PROBE_TIMEOUT_MS = 2500;

let probePromise = null;
let available = false;

function getOrigin() {
  const origin = String(globalThis.location?.origin || "");
  return /^https?:\/\//i.test(origin) ? origin : "";
}

export function getBrowserEngineBaseUrl() {
  const origin = getOrigin();
  return origin ? `${origin}${BROWSER_ENGINE_PATH}` : "";
}

export function isBrowserEngineBaseUrl(value = "") {
  const base = getBrowserEngineBaseUrl();
  const url = String(value || "").trim();
  return Boolean(base) && (url === base || url.startsWith(`${base}/`) || url.startsWith(`${base}?`));
}

async function probe() {
  const baseUrl = getBrowserEngineBaseUrl();
  if (!baseUrl || typeof fetch !== "function") {
    return false;
  }
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = setTimeout(() => controller?.abort(), PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}/settings`, {
      cache: "no-store",
      signal: controller?.signal
    });
    return response.ok;
  } catch (_) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export const BrowserEngineFsService = {
  isAvailable() {
    if (!Platform.isBrowser()) {
      return false;
    }
    if (!probePromise) {
      void this.ensureStarted();
    }
    return available;
  },

  ensureStarted() {
    if (!Platform.isBrowser()) {
      return Promise.resolve({ status: "unsupported" });
    }
    if (!probePromise) {
      probePromise = probe().then((ok) => {
        available = ok;
        if (!ok) {
          // Allow a later retry, e.g. when the server starts after the page.
          setTimeout(() => {
            probePromise = null;
          }, 15000);
        }
        return ok;
      });
    }
    return probePromise.then((ok) =>
      ok
        ? { status: "success", baseUrl: getBrowserEngineBaseUrl() }
        : { status: "error", detail: "Streaming server not reachable at /engine" }
    );
  },

  getLocalBaseUrls() {
    const base = getBrowserEngineBaseUrl();
    return base ? [base] : [];
  }
};
