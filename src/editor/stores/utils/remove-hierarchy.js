import {BundlerAPI, Entity} from "../../../../public/engine/production";

export default function removeHierarchy(state, entity) {
    if (!entity)
        return
    for (let c = 0; c < entity.children.length; c++)
        removeHierarchy(state, entity.children[c])

    if (entity instanceof Entity)
        BundlerAPI.removeEntity(entity.id)
    else
        state.delete(entity.id)
}
