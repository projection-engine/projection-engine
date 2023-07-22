import AbstractSingleton from "../../../../../shared/AbstractSingleton";

export default class ToastNotificationSystem extends AbstractSingleton {
    defaultDelay = 3500
    success = (...messages: string[]): void => null
    error = (...messages: string[]): void => null
    warn = (...messages: string[]): void => null
    log = (...messages: string[]): void => null
    target

    constructor() {
        super();
        const target = this.target = document.createElement("div")
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

        this.log = (...messages) => this.#pushAlert(messages.join(" "), "info")
        this.warn = (...messages) => this.#pushAlert(messages.join(" "), "alert")
        this.error = (...messages) => this.#pushAlert(messages.join(" "), "error")
        this.success = (...messages) => this.#pushAlert(messages.join(" "), "success")
    }

    static getInstance(): ToastNotificationSystem {
        return super.get<ToastNotificationSystem>()
    }

    #pushAlert(message, type) {
        const target = this.target
        let variant
        switch (type) {
            case "success":
                variant = {color: "#03c403", icon: "done"}
                break
            case "alert":
                variant = {color: "#d97a00", icon: "warning"}
                break
            case "info":
                variant = {color: "#0095ff", icon: "info"}
                break
            default:
                variant = {color: "#ff5555", icon: "error"}
                break
        }

        const newElement = document.createElement("div")

        let i = 0
        while (target.children.length > 4) {
            target.removeChild(target.children[i])
            i++
        }

        target.appendChild(newElement)
        target.style.zIndex = "9999"

        setTimeout(() => this.#close(newElement), this.defaultDelay)
        newElement.innerHTML = `
                <div class="alertContainer alert-modal" style="--background: ${variant.color}">
                    <div class="content alert-modal">
                        <div class="icon alert-modal">
                            <span data-svelteicon="-">${variant.icon}</span>
                        </div>
                        ${message}
                    </div>
                    <button class="button alert-modal" data-svelteaction="-">
                        <span data-svelteicon="-" style="height: 1.1rem; font-size: 1.1rem">close</span>
                    </button>
                </div>
            `

        newElement
            .getElementsByTagName("button")[0]
            .addEventListener(
                "click",
                () => this.#close(newElement),
                {once: true}
            )
    }

    #close(newElement) {
        const target = this.target
        newElement.className = "outAnimation alert-modal"
        newElement.addEventListener("animationend", () => {
            if (newElement.parentElement === target)
                target.removeChild(newElement)
        }, {once: true})
    }

}