import QueryAPI from "../../../public/engine/production/apis/utils/QueryAPI";
import {Engine} from "../../../public/engine/production";

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
    static surfaceSelected = {}
    static hierarchy = []
    static updateSurface(lockedEntity, selected) {
        const surface = {}
        if (lockedEntity) {
            const found = findSurface(lockedEntity, open)
            if (found) {
                if (!surface[found[0]])
                    surface[found[0]] = []
                surface[found[0]].push(found[1])
            }
            for (let i = 0; i < selected.length; i++) {
                if (selected[i] === lockedEntity)
                    continue
                const found = findSurface(selected[i], open)
                if (!found)
                    continue
                if (!surface[found[0]])
                    surface[found[0]] = []
                surface[found[0]].push(found[1])
            }
        }
        HierarchyController.surfaceSelected = surface
    }

    static updateHierarchy(){
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
}