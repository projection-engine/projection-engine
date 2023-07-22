import LoggerTypes from "../enums/LoggerTypes"


export default class RendererLogger {
	static #level = LoggerTypes.SILENT
	static #isInitialized = false
	static #originalConsoleMethods = {}
	static #afterExecution?: Function

	static get level() {
		return RendererLogger.#level
	}

	static set level(data) {
		RendererLogger.#level = data
		localStorage.setItem("LOGGER_LEVEL", RendererLogger.#level)
	}

	static initialize() {
		if (RendererLogger.#isInitialized)
			return
		Object.assign(RendererLogger.#originalConsoleMethods, console)
		RendererLogger.#level = (localStorage.getItem("LOGGER_LEVEL") as LoggerTypes) || LoggerTypes.SILENT
		localStorage.setItem("LOGGER_LEVEL", RendererLogger.#level)
		console.log = RendererLogger.log
		console.error = RendererLogger.error
		console.warn = RendererLogger.warn

		RendererLogger.#isInitialized = true
		const {ipcRenderer} = window.require("electron")
		RendererLogger.#afterExecution = (messages, type) => {
			RendererLogger.#originalConsoleMethods[type](...messages)
			if (RendererLogger.#level !== LoggerTypes.SILENT) {
				ipcRenderer.send("LOGGER", {message: messages, type, loggerLevel: RendererLogger.#level})
			}
		}
	}

	static log(...messages) {
		RendererLogger.#afterExecution?.(messages, "log")
	}

	static warn(...messages) {
		RendererLogger.#afterExecution?.(messages, "warn")
	}

	static error(...messages) {
		RendererLogger.#afterExecution?.(messages, "error")
	}
}