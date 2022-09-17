import {EntityAPI, Entity} from "../../../../public/engine/production";

export default function removeHierarchy(state, entity) {
    if (!entity)
        return
    for (let c = 0; c < entity.children.length; c++)
        removeHierarchy(state, entity.children[c])

    EntityAPI.removeEntity(entity.id)
}
