import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";


export default class TabContextController {
    static activeContext?: Function
    static contexts = new Map<string, Function>()
    static contextElements = new Map<string, HTMLElement>()
    static #initialized = false;
    static contextID = crypto.randomUUID()

    static initialize() {
        if (TabContextController.#initialized)
            return
        TabContextController.#initialized = true
        // TODO - ADD OPTIONS AND INTEGRATE WITH TABS
        ContextMenuController.mount(
            [
                {
                    label: LOCALIZATION_EN.CLOSE_ALL,
                    callback: () => TabContextController.activeContext?.("CLOSE_ALL")
                },
                {
                    label: LOCALIZATION_EN.CREATE,
                    callback: () => TabContextController.activeContext?.("CREATE")
                }
            ],
            TabContextController.contextID
        )
        document.addEventListener("mousedown", TabContextController.#handler)
    }

    static #handler(e: MouseEvent) {
        const target = e.composedPath().map((element: HTMLElement) => {
            const t = TabContextController.contexts.get(element?.id)
            if (t)
                return t
            return null
        })
        TabContextController.activeContext = target.find(t => t !== null)
    }

    static registerContext(id: string, callback: Function) {
        TabContextController.contextElements.set(id, document.getElementById(id))
        TabContextController.contexts.set(id, callback)
    }

    static removeContext(id: string) {
        TabContextController.contexts.delete(id)
    }
}