import { App, BrowserWindow } from "electron";
import path from "path";
import url from "url";

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		useContentSize: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	//mainWindow.removeMenu();

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "index.html"),
			protocol: "file:",
			slashes: true,
		})
	);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

App.on("ready", createWindow);

App.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		App.quit();
	}
});

App.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
