import { app, BrowserWindow, globalShortcut, webFrameMain } from "electron";
import { ipcMain as ipc } from "electron-better-ipc";
import serve from "electron-serve";
import { readFile } from "fs/promises";
import fetch from "node-fetch";
import { join } from "path";
import { createWindow } from "./helpers";
import { omitSecurityHeadersAndBlockAds } from "./helpers/web-requests";

const isProd: boolean = process.env.NODE_ENV === "production";
const isLinux = process.platform === "linux";

const port = process.argv[2];
const devURL = `http://localhost:${port}`;

let mainWindow: BrowserWindow | undefined;
let experimentalVideoCSS = false;
let forceDetachKeybindActive = false;
const videoCSSOnScript =
  'document.documentElement.classList.add("flot-video");';
const videoCSSOffScript =
  'document.documentElement.classList.remove("flot-video");';

if (isLinux) {
  // https://github.com/electron/electron/issues/25153#issuecomment-843688494
  app.commandLine.appendSwitch("use-gl", "desktop");
}

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  globalShortcut.register("CmdOrCtrl+Alt+I", () => {
    mainWindow?.setIgnoreMouseEvents(!forceDetachKeybindActive);
    forceDetachKeybindActive = !forceDetachKeybindActive;
  });

  const embedCssFilePromise = isProd
    ? readFile(join(__dirname, "css", "embed.css"), { encoding: "utf8" })
    : fetch(`${devURL}/css/embed.css`).then((r) => r.text());

  const embedCss = embedCssFilePromise.catch((e) => {
    console.error(e);
    return "";
  });

  await new Promise((r) => setTimeout(r, isLinux ? 750 : 350)); // required otherwise transparency won't work consistently cross-platform...

  mainWindow = createWindow("main", {
    transparent: true,
    title: "Flōt",
    titleBarStyle: undefined,
    trafficLightPosition: undefined,
    skipTaskbar: false,
    frame: false,
    maximizable: false,
    fullscreenable: false,
    enableLargerThanScreen: false,
    acceptFirstMouse: false,
    roundedCorners: true,
    autoHideMenuBar: true,
    minHeight: 200,
    minWidth: 300,
    maxHeight: 1000,
    maxWidth: 1000,
    icon: join(__dirname, "images", "logo", "256x256.png"),
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      webSecurity: false,
    },
  });

  await omitSecurityHeadersAndBlockAds(mainWindow.webContents.session);

  mainWindow.setVisibleOnAllWorkspaces(true);

  mainWindow.webContents.on(
    "did-fail-provisional-load",
    (
      event,
      code,
      desc,
      validatedUrl,
      isMainFrame,
      frameProcessId,
      frameRoutingId
    ) => {
      if (mainWindow)
        ipc.callRenderer(mainWindow, "iframe-load-failure", validatedUrl);
    }
  );

  mainWindow.webContents.on(
    "did-frame-navigate",
    async (
      event,
      url,
      status,
      statusText,
      isMainFrame,
      frameProcessId,
      frameRoutingId
    ) => {
      if (isMainFrame) return;
      if (url === "about:blank") return;

      const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);

      if (frame) {
        frame.executeJavaScript(`document.addEventListener('DOMContentLoaded', () => {
            // post back to the parent app so we know we loaded (also gives us the final resolved url after redirects)
            parent.postMessage({key: 'location', msg: location.href}, "*")

            window.addEventListener('focus', () => parent.postMessage({key: 'active', msg: true}, "*"))
            window.addEventListener('blur', () => parent.postMessage({key: 'active', msg: false}, "*"))
            
            document.addEventListener('mouseenter', () => parent.postMessage({key: 'hover', msg: true}, "*"))
            document.addEventListener('mouseleave', () => parent.postMessage({key: 'hover', msg: false}, "*"))

            // add marker to document that it can opt into embedded css
            document.documentElement.classList.add("flotapp");

            // prepare embed stylesheet
            Array.from(document.querySelectorAll('[data-flot]')).forEach(s => s.remove());
            const link = document.createElement('style');
            link.setAttribute('data-flot', 'true');
            link.textContent = \`${await embedCss}\`
            document.head.appendChild(link);

            ${experimentalVideoCSS ? videoCSSOnScript : videoCSSOffScript}
          }, {once: true})
        `);
      }
    }
  );

  mainWindow.webContents.on(
    "did-navigate-in-page",
    async (event, url, isMainFrame, frameProcessId, frameRoutingId) => {
      if (isMainFrame) return;
      if (url === "about:blank") return;

      const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);

      if (frame) {
        frame.executeJavaScript(
          `parent.postMessage({key: 'location', msg: location.href}, "*")`
        );
      }
    }
  );

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");

    app
      .whenReady()
      .then(() => import("electron-updater"))
      .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error("Failed check updates:", e));
  } else {
    await mainWindow.loadURL(`${devURL}/`);
    // mainWindow.webContents.openDevTools({ mode: 'detach', activate: false });
  }
})();

ipc.answerRenderer("please-enable-video-css", () => {
  getFlotEmbed()?.executeJavaScript(videoCSSOnScript);
  experimentalVideoCSS = true;
});
ipc.answerRenderer("please-disable-video-css", () => {
  getFlotEmbed()?.executeJavaScript(videoCSSOffScript);
  experimentalVideoCSS = false;
});
ipc.answerRenderer("please-detach", () =>
  mainWindow?.setIgnoreMouseEvents(true)
);
ipc.answerRenderer("please-attach", () => {
  if (!forceDetachKeybindActive) mainWindow?.setIgnoreMouseEvents(false);
});
ipc.answerRenderer("please-quit", () => app.quit());

app.on("window-all-closed", () => app.quit());
app.on("will-quit", () => globalShortcut.unregisterAll());

function getFlotEmbed() {
  const frames = mainWindow?.webContents.mainFrame.frames ?? [];

  // Some websites seem to cause the embed frame to be renamed...not sure how, it's
  // supposed to be a readonly property, but ah well, if this happens, just try the
  // using the first frame
  return frames.find((f) => f.name === "flot-embed") ?? frames[0];
}
