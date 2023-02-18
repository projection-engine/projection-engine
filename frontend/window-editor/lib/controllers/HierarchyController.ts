import Engine from "../../../../engine-core/Engine";
import SelectionStore from "../../../shared/stores/SelectionStore";
import Entity from "../../../../engine-core/instances/Entity";
import HierarchyToRenderElement from "../../views/hierarchy/template/ToRenderElement";


export default class HierarchyController {
    static hierarchy: HierarchyToRenderElement[] = []
    static #listening: { [key: string]: Function } = {}

    static updateHierarchy() {
        const data = [], root = Engine.loadedLevel
        if(!root)
            return

        const callback = (node: Entity, depth: number) => {
            if(!node)
                return
            data.push({node, depth})
            node.allComponents.forEach(component => data.push({component, depth: depth + 1}))

            const children = node.children.array
            for (let i = 0; i < children.length; i++)
                callback(children[i], depth + 1)
        }
        callback(root, 0)
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
        const node = Engine.entities.get(SelectionStore.mainEntity)
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