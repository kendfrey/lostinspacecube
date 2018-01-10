import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

let mainWindow: BrowserWindow | undefined;

app.on("ready", () =>
{
	mainWindow = new BrowserWindow({ width: 1803, height: 903, useContentSize: true, autoHideMenuBar: true });
	mainWindow.loadURL(url.format({ pathname: path.join(__dirname, "html/index.html"), protocol: "file:", slashes: true }));
	mainWindow.on("closed", () => { mainWindow = undefined; });
});
