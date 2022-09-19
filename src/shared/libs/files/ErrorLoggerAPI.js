import FilesAPI from "./FilesAPI";
import ERROR_LOG_FILE from "../../../static/ERROR_LOG_FILE";
import ConsoleAPI from "../../../../public/engine/production/apis/ConsoleAPI";

export default class ErrorLoggerAPI {
    static #timeout
    static #initialized = false

    static get path() {
        return localStorage.getItem("basePath") + FilesAPI.sep + ERROR_LOG_FILE
    }

    static initialize() {
        if (ErrorLoggerAPI.#initialized)
            return
        ErrorLoggerAPI.#initialized = true

        FilesAPI.readFile(ErrorLoggerAPI.path).then(o => {
            const original = o ? o : ""
            const old = console.error
            console.error = (...messages) => {
                clearTimeout(ErrorLoggerAPI.#timeout)
                ErrorLoggerAPI.#timeout = setTimeout(() => {
                    const date = new Date()
                    const parsed = messages.map(m => {
                        let message, cause
                        if (m instanceof Error) {
                            cause = m.cause
                            message = m.message
                        }
                        else if (typeof m === "object"){
                            cause = "undefined"
                            message = JSON.stringify(m)
                        }
                        else {
                            cause = "undefined"
                            message = m
                        }
                        return  `DATE_TIME [${date.toDateString()}] MESSAGE [${message}] CAUSE [${cause}]`
                    })
                    const p = ErrorLoggerAPI.path
                    FilesAPI.writeFile(p, original + "\n" + parsed.join("\n"), true).catch()
                    parsed.forEach(m => ConsoleAPI.error(m))

                }, 150)
                const primary = messages[0]
                if (primary instanceof Error)
                    alert.pushAlert(primary.message, "error")
                old(...messages)
            }
        })

    }
}