import parseMessage from "./parse-console-message"
import MessageInterface from "../../static/MessageInterface"

export enum Types {
    ERROR = "ERROR",
    LOG = "LOG",
}

export default class ConsoleAPI {
	static #registeredConsoles = []
	static #messages: MessageInterface[] = []
	static #metadata = {errors: 0, logs: 0}

	static #updateConsoles() {
		const consoles = ConsoleAPI.#registeredConsoles
		for (let i = 0; i < consoles.length; i++) {
			consoles[i].onUpdate?.(
				ConsoleAPI.#metadata,
				ConsoleAPI.#messages
			)
		}
	}

	static #pushMessages(type, messages, src = null) {
		ConsoleAPI.#messages.push(...parseMessage(messages, type, src))

		ConsoleAPI.#metadata.errors += type === Types.ERROR ? 1 : 0
		ConsoleAPI.#metadata.logs += type === Types.LOG ? 1 : 0


		if (ConsoleAPI.#messages.length > 50)
			ConsoleAPI.#messages.shift()

		ConsoleAPI.#updateConsoles()
	}

	static clear() {
		if (ConsoleAPI.#messages.length === 0)
			return
		ConsoleAPI.#messages = []
		ConsoleAPI.#metadata = {errors: 0, logs: 0}

		ConsoleAPI.#updateConsoles()
	}

	static addListener(element, onUpdate) {
		ConsoleAPI.#registeredConsoles = [...ConsoleAPI.#registeredConsoles, {element, onUpdate}]
		ConsoleAPI.#updateConsoles()
	}

	static removeListener(element) {
		ConsoleAPI.#registeredConsoles = ConsoleAPI.#registeredConsoles.filter(c => c.element !== element)
	}

	static log(...messages) {
		console.log(messages)
		ConsoleAPI.#pushMessages(Types.LOG, messages)
	}

	static error(...messages) {
		console.log(messages)
		let src
		try {
			throw new Error()
		} catch (e) {
			const stack = e.stack.split("\n")
			src = stack[2].replace(/\(eval\sat\s(\w+)\s\(((\/|\:|\w|\.|\W)+)\), <anonymous>:/gm, "").replace(")", "")
		}
		if (src.includes("file:///"))
			src = "Internal error"
		ConsoleAPI.#pushMessages(Types.ERROR, messages, src)
	}

	static get TYPES() {
		return Types
	}
}

