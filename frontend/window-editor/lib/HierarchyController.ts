import Engine from "../../../engine-core/Engine";
import SelectionStore from "../../shared/stores/SelectionStore";
import Entity from "../../../engine-core/instances/Entity";
import ToRenderElement from "../views/hierarchy/template/ToRenderElement";
import PROJECT_FOLDER_STRUCTURE from "../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import FS from "../../shared/lib/FS/FS";


export default class HierarchyController {
    static hierarchy: ToRenderElement[] = []
    static #listening: { [key: string]: Function } = {}
    static currentLevel: string

    static updateHierarchy() {
        const data = [], entitiesArray = Engine.entities.array
        const size = entitiesArray.length

        let currentLevel = Engine.loadedLevel || PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
        currentLevel = currentLevel.split(FS.sep).pop().split(".").pop()
        console.trace(currentLevel)
        HierarchyController.currentLevel = currentLevel

        const callback = (node: Entity, depth: number) => {
            data.push({node, depth})
            const children = node.children
            for (let i = 0; i < children.length; i++)
                callback(children[i], depth + 1)
        }
        for (let i = 0; i < size; i++) {
            const current = entitiesArray[i]
            if (current.parent)
                continue
            callback(current, 0)
        }
        HierarchyController.hierarchy = data
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