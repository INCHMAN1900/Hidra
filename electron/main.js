import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

import { setMacProxySettings } from "./proxy.js";
import { postToBluesky, postToTwitter } from "./platform.js";
import store, { credientialsKey } from "./store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:28718");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  return win;
}

app.whenReady().then(() => {
  const mainWindow = createWindow();

  setMacProxySettings();

  ipcMain.on("post-to-socials", async (event, postContent) => {
    try {
      const { text, postToTwitter: twitterEnabled, postToBluesky: blueskyEnabled } = postContent;
      let files = postContent.files.map((file) => {
        return {
          buffer: Buffer.from(file.base64, "base64"),
          mimeType: file.mimeType,
        };
      });

      const promises = [];
      if (twitterEnabled) {
        promises.push(postToTwitter(text, files));
      }
      if (blueskyEnabled) {
        promises.push(postToBluesky(text, files))
      }

      await Promise.allSettled(promises)
        .then((results) => {
          const response = {};
          if (twitterEnabled) {
            response.twitter = results[0]
            response.bluesky = results[1]
          } else {
            response.bluesky = results[0]
          }
          mainWindow.webContents.send("post-response", response);
        })
    } catch (error) {
      mainWindow.webContents.send("post-error", error);
    }
  });

  ipcMain.on("save-credentials", async (event, credentials) => {
    store.set(credientialsKey, credentials)
  })

  ipcMain.handle("get-credentials", () => {
    console.log(store.get(credientialsKey))
    return store.get(credientialsKey) ?? {}
  })
});


app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const PORT = process.env.PORT || 3001;
expressApp.listen(PORT, () => console.log(`Server running on port ${PORT}`));
