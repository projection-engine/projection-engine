import Engine from "../../../../engine-core/Engine";
import SelectionStore from "../../../shared/stores/SelectionStore";



export default class HierarchyController {
    static #listening: { [key: string]: Function } = {}

    static updateHierarchy() {
        Object.values(HierarchyController.#listening).forEach(v => v())
    }

    static removeListener(internalID: string) {
        delete HierarchyController.#listening[internalID]
    }

    static registerListener(internalID: string, callback: Function) {
        HierarchyController.#listening[internalID] = callback
        callback()
    }

    static openTree() {
        const node = Engine.entities.map.get(SelectionStore.mainEntity)
        if (!node)
            return {}
        const open = {}

        let target = node
        while (target?.parent != null) {
            if (open[target.id])
                break
            open[target.id] = true
            target = target.parent
        }
        Object.values(HierarchyController.#listening).forEach(v => v({...open}))
    }
}