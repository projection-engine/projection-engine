import {ipcMain} from "electron"
import LoggerTypes from "../enums/LoggerTypes"
import * as path from "path"
import * as fs from "fs"


export default class MainLogger {
	static #level = LoggerTypes.SILENT
	static #isInitialized = false
	static #writePath?: string
	static #originalConsoleMethods = {}
	static #afterExecution?: Function

	static initialize() {
		if (MainLogger.#isInitialized)
			return
		Object.assign(MainLogger.#originalConsoleMethods, console)
		console.log = MainLogger.log
		console.error = MainLogger.error
		console.warn = MainLogger.warn
		MainLogger.#isInitialized = true
		MainLogger.#writePath = path.join(__dirname, "main.log")
		if (!fs.existsSync(MainLogger.#writePath))
			fs.writeFileSync(MainLogger.#writePath, "")
		MainLogger.#afterExecution = (message, type) => {
			switch (MainLogger.#level) {
			case LoggerTypes.DETAILED: {
				const time = new Date()
				const logMessage = `\n[${time.toUTCString()}] - {${type}}: ${message}`
				MainLogger.#originalConsoleMethods[type](logMessage)
				fs.promises.appendFile(MainLogger.#writePath, logMessage).catch()
				break
			}
			case LoggerTypes.SILENT:
				MainLogger.#originalConsoleMethods[type](message)
				return
			}
		}
		ipcMain.on("LOGGER", (event, data) => {
			try {
				const {message, type, loggerLevel} = data
				MainLogger.#level = loggerLevel || LoggerTypes.DETAILED
				MainLogger[type](message)
			} catch (err) {
				console.error(err)
			}
		})
	}


	static log(...messages) {
		MainLogger.#afterExecution?.(messages, "log")
	}

	static warn(...messages) {
		MainLogger.#afterExecution?.(messages, "warn")
	}

	static error(...messages) {
		MainLogger.#afterExecution?.(messages, "error")
	}
}