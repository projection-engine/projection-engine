import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"
import COMPONENTS from "../engine/data/COMPONENTS"

let entities = new Map(), updated = false, hierarchy = []

self.onmessage = ({data: {type, payload, actionID}}) => {
    switch (type) {
    case ENTITY_WORKER_ACTIONS.GET_HIERARCHY: {
        self.postMessage({actionID, payload: hierarchy})
        break
    }
    case ENTITY_WORKER_ACTIONS.UPDATE_ENTITIES: {
        updated = true
        entities = payload

        const data = [], entitiesArray = Array.from(entities.values())
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
        hierarchy = data
        break
    }
    case ENTITY_WORKER_ACTIONS.GET_UNUSED_DATA: {
        if(updated) {
            const {materials, meshes} = payload
            const meshesFiltered = meshes.reduce((obj, currentValue) => {
                    obj[currentValue] = currentValue
                    return obj
                }, {}),
                materialsFiltered = {...materials}
            const values = entities.values()

            for (let i = 0; i < values.length; i++) {
                const meshComp = values[i].components[COMPONENTS.MESH]

                if (meshComp !== undefined) {
                    delete meshesFiltered[meshComp.meshID]
                    delete materialsFiltered[meshComp.materialID]
                }
            }

            self.postMessage({actionID, payload: {meshesFiltered, materialsFiltered}})
        }
        else
            self.postMessage({actionID, payload: {meshesFiltered: {}, materialsFiltered: {}}})
        break
    }
    default:
        break
    }


}