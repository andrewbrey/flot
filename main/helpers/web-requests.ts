import { ElectronBlocker, fullLists, Request } from "@cliqz/adblocker-electron";
import { app, Session } from "electron";
import { readFile, writeFile } from "fs/promises";
import { omitBy, toLower } from "lodash";
import fetch from "cross-fetch";
import path from "path";

const verbose = false; // change to true for request block logs
const engineCacheVersion = 1;

// Extra sources thanks to https://github.com/th-ch/youtube-music/blob/master/plugins/adblocker/blocker.js
const SOURCES = [
  "https://raw.githubusercontent.com/kbinani/adblock-youtube-ads/master/signed.txt",
  // uBlock Origin
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt",
  "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters-2021.txt",
  // Fanboy Annoyances
  "https://secure.fanboy.co.nz/fanboy-annoyance_ubo.txt",
];

export async function omitSecurityHeadersAndBlockAds(session: Session) {
  const cachingOptions = {
    path: path.resolve(
      app.getPath("userData"),
      `ad-blocker-engine-v${engineCacheVersion}.bin`
    ),
    read: readFile,
    write: writeFile,
  };

  const blocker = await ElectronBlocker.fromLists(
    fetch,
    [...fullLists, ...SOURCES],
    { loadNetworkFilters: true },
    cachingOptions
  );
  blocker.enableBlockingInSession(session);

  session.webRequest.onHeadersReceived(
    { urls: ["*://*/*"] },
    (details, callback) => {
      const responseHeaders = omitBy(
        { ...(details?.responseHeaders ?? {}) },
        (value, key) =>
          ["x-frame-options", "content-security-policy"].includes(toLower(key))
      );

      callback({ cancel: false, responseHeaders });
    }
  );

  if (process.env.NODE_ENV === "development" && verbose) {
    blocker.on("request-allowed", (request: Request) => {
      console.log("allowed", request.tabId, request.url);
    });

    blocker.on("request-blocked", (request: Request) => {
      console.log("blocked", request.tabId, request.url);
    });

    blocker.on("request-redirected", (request: Request) => {
      console.log("redirected", request.tabId, request.url);
    });

    blocker.on("request-whitelisted", (request: Request) => {
      console.log("whitelisted", request.tabId, request.url);
    });

    blocker.on("csp-injected", (request: Request) => {
      console.log("csp", request.url);
    });

    blocker.on("script-injected", (script: string, url: string) => {
      console.log("script", script.length, url);
    });

    blocker.on("style-injected", (style: string, url: string) => {
      console.log("style", style.length, url);
    });
  }
}
