import pushAlert from "./push-alert"

export default class AlertController {
	static defaultDelay = 3500
	static success = (...messages: string[]): void => null
	static error = (...messages: string[]): void => null
	static warn = (...messages: string[]): void => null
	static log = (...messages: string[]): void => null
	static target
	static #initialized = false

	static initialize() {
		if (AlertController.#initialized)
			return
		AlertController.#initialized = true
		const target = AlertController.target = document.createElement("div")
		Object.assign(target.style, {
			"position": "fixed",
			"z-index": "9999",
			"bottom": "4px",
			"left": " 50%",
			"transform": "translateX(-50%)",
			"display": "grid",
			"align-items": "flex-end",
			"justify-items": "center",
			"gap": "4px",
		}
		)
		document.body.appendChild(target)

		AlertController.log = (...messages) => pushAlert(messages.join(" "), "info")
		AlertController.warn = (...messages) => pushAlert(messages.join(" "), "alert")
		AlertController.error = (...messages) => pushAlert(messages.join(" "), "error")
		AlertController.success = (...messages) => pushAlert(messages.join(" "), "success")
	}
}