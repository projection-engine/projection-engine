import ContextMenuController from "../ContextMenuController";
import ROUTES from "../../../../../backend/static/ROUTES";
import MutableObject from "../../../../../engine-core/MutableObject";
import Electron from "../../Electron";

export default function getContextAction() {
    let startPosition = undefined
    let open = false
    return (event) => {
        event.preventDefault()
        if (ContextMenuController.blockContext)
            return;
        ContextMenuController.currentX = event.clientX
        ContextMenuController.currentY = event.clientY
        const elements = document.elementsFromPoint(event.clientX, event.clientY)
        let focused
        for (let i = 0; i < elements.length; i++) {
            if ("getAttribute" in elements[i]) {
                const ID = elements[i].id
                const dataID = elements[i].getAttribute("data-sveltecontextid")
                const found = ContextMenuController.data.targets[ID] || ContextMenuController.data.targets[dataID]
                if (!found)
                    continue
                focused = found
            }
        }
        if (focused) {
            startPosition = {x: event.clientX, y: event.clientY}
            ContextMenuController.data.focused = focused
        } else
            return

        let targetElement
        const allowAll = !ContextMenuController.data.focused.triggers || ContextMenuController.data.focused.triggers.length === 0

        if (allowAll)
            targetElement = event.target
        else {
            const allElements = document.elementsFromPoint(event.clientX, event.clientY)
            for (let i = 0; i < allElements.length; i++) {
                const currentElement = allElements[i]
                let hasAttribute = false
                const attributes = Array.from(currentElement.attributes)

                for (let i = 0; i < attributes.length; i++) {
                    const attr = attributes[i]
                    if (!attr.nodeName.includes("data-svelte"))
                        continue
                    const has = ContextMenuController.data.focused.triggers.find(f => attr.nodeName === f)
                    hasAttribute = hasAttribute || has !== undefined
                }
                if (hasAttribute) {
                    targetElement = currentElement
                    break;
                }
            }
        }
        if (targetElement) {
            let trigger = allowAll ? targetElement : undefined
            if (!trigger)
                Array.from(targetElement.attributes).forEach((attr: MutableObject ) => {
                    const has = ContextMenuController.data.focused.triggers.find((f) => attr.nodeName === f)
                    if (has)
                        trigger = has
                })
            open = true
            if (ContextMenuController.data.focused.onFocus)
                ContextMenuController.data.focused.onFocus(trigger, targetElement, event)

            Electron.ipcRenderer.send(ROUTES.OPEN_CONTEXT_MENU, ContextMenuController.data.focused.id)
        }
    }
}

