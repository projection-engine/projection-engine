import FilesAPI from "./FilesAPI";
import ERROR_LOG_FILE from "../../../static/ERROR_LOG_FILE";

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
                    const p = ErrorLoggerAPI.path
                    FilesAPI.writeFile(p, original + "\n" + JSON.stringify(messages), true).catch()
                })

                old(...messages)
            }
        })

    }
}