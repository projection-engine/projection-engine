import ElectronWindowService from "./ElectronWindowService"
import SETTINGS_PATH from "./static/SETTINGS_PATH"
import DEFAULT_GLOBAL_SETTINGS from "./static/DEFAULT_GLOBAL_SETTINGS"

import {app, BrowserWindow} from "electron"
import * as os from "os"
import * as fs from "fs"
import * as path from "path"

function main() {
	let settingsFile = DEFAULT_GLOBAL_SETTINGS
	if (fs.existsSync(os.homedir() + path.sep + SETTINGS_PATH)) {
		try {
			settingsFile = {...settingsFile, ...JSON.parse(fs.readFileSync(os.homedir() + path.sep + SETTINGS_PATH).toString())}
		} catch (err) {
			console.error(err)
		}
	}


	app.commandLine.appendSwitch("js-flags", "--max-old-space-size=" + settingsFile.maxMemory)
	app.commandLine.appendSwitch("use-angle", settingsFile.graphicsBackend)

	if (!settingsFile.vsync)
		app.commandLine.appendSwitch("--disable-frame-rate-limit")

	app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer")

	app.on("ready", _ => {
		ElectronWindowService.destroy()
		ElectronWindowService.get()
	})
	app.on("window-all-closed", async () => {
		if (process.platform !== "darwin" && !ElectronWindowService.getInstance().preventAppClosing)
			app.quit()
		ElectronWindowService.getInstance().preventAppClosing = false
	})
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			ElectronWindowService.destroy()
			ElectronWindowService.get()
		}
	})
}

main()