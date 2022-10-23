import QueryAPI from "../../public/engine/lib/apis/utils/QueryAPI";
import Engine from "../../public/engine/Engine";
import SelectionStore from "../stores/SelectionStore";

function findSurface(e, open) {
    const entity = QueryAPI.getEntityByID(e)
    if (!entity)
        return
    let surface
    if (entity.parent) {
        surface = []
        let current = entity.parent
        while (current) {
            const breakTime = !open[current?.id] && open[current?.parent?.id]

            if (!current.parent || breakTime) {

                surface[0] = current.id
                surface[1] = e
                break
            }

            current = current?.parent
        }
    }
    return surface
}

export default class HierarchyController {
    static hierarchy = []

    static updateHierarchy() {
        const data = [], entitiesArray = Array.from(Engine.entitiesMap.values())
        const callback = (node, depth) => {
            data.push({node, depth})
            for (let i = 0; i < node.children.length; i++)
                callback(node.children[i], depth + 1)
        }
        for (let i = 0; i < entitiesArray.length; i++) {
            if (entitiesArray[i].parent !== undefined)
                continue
            callback(entitiesArray[i], 0)
        }
        HierarchyController.hierarchy = data
    }

    static openTree() {
        const node = Engine.entitiesMap.get(SelectionStore.mainEntity)
        if (!node)
            return {}
        const open = {}

        let target = node
        while (target.parent != null) {
            open[target.id] = true
            target = target.parent
        }

        open[target.id] = true
        return open
    }
}