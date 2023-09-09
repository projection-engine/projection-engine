import serializeStructure from "@engine-core/utils/serialize-structure";
import UUIDGen from "../../../../shared/UUIDGen";

export enum Types {
    ERROR = "ERROR",
    LOG = "LOG",
}

export default class ConsoleManager {
    static #registeredConsoles = []
    static #messages: ConsoleMessage[] = []
    static #metadata = {errors: 0, logs: 0}

    static #updateConsoles() {
        const consoles = ConsoleManager.#registeredConsoles
        for (let i = 0; i < consoles.length; i++) {
            consoles[i].onUpdate?.(
                ConsoleManager.#metadata,
                ConsoleManager.#messages
            )
        }
    }

    static #pushMessages(type, messages, src = null) {
        ConsoleManager.#messages.push(...ConsoleManager.#parseMessage(messages, type, src))

        ConsoleManager.#metadata.errors += type === Types.ERROR ? 1 : 0
        ConsoleManager.#metadata.logs += type === Types.LOG ? 1 : 0


        if (ConsoleManager.#messages.length > 50)
            ConsoleManager.#messages.shift()

        ConsoleManager.#updateConsoles()
    }

    static clear() {
        if (ConsoleManager.#messages.length === 0)
            return
        ConsoleManager.#messages = []
        ConsoleManager.#metadata = {errors: 0, logs: 0}

        ConsoleManager.#updateConsoles()
    }

    static addListener(element, onUpdate) {
        ConsoleManager.#registeredConsoles = [...ConsoleManager.#registeredConsoles, {element, onUpdate}]
        ConsoleManager.#updateConsoles()
    }

    static removeListener(element) {
        ConsoleManager.#registeredConsoles = ConsoleManager.#registeredConsoles.filter(c => c.element !== element)
    }

    static log(...messages) {
        console.log(messages)
        ConsoleManager.#pushMessages(Types.LOG, messages)
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
        ConsoleManager.#pushMessages(Types.ERROR, messages, src)
    }

    static get TYPES() {
        return Types
    }

    static #parseMessage(messages: any[], type, src): ConsoleMessage[] {
        const isPlainObject = value => value?.constructor === Object
        const parts: ConsoleMessage[] = []
        for (let i = 0; i < messages.length; i++) {
            const blockID = UUIDGen()
            if (typeof messages[i] === "object") {
                const str = isPlainObject(messages[i]) ? "Plain Object" : messages[i].constructor.name
                parts.push(...str.split("\n").map((message, i) => ({
                    type,
                    message: message + " " + messages[i].toString(),
                    object: serializeStructure(messages[i]),
                    blockID,
                    src,
                    notFirstOnBlock: i > 0
                })))
            } else
                parts.push({
                    type,
                    message: messages[i],
                    blockID,
                    src
                })
        }
        return parts
    }

}

