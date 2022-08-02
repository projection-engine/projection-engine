import COMPONENTS from "../libs/engine/data/COMPONENTS";

export default function  updateEntityTransformation(axis, data, key, entity) {
    const component = entity.components[COMPONENTS.TRANSFORM]
    const prev = component[key]
    component[key] = [
        axis === "x" ? data : prev[0],
        axis === "y" ? data : prev[1],
        axis === "z" ? data : prev[2]
    ]

    if (entity.components[COMPONENTS.POINT_LIGHT])
        entity.components[COMPONENTS.POINT_LIGHT].changed = true
    if (entity.components[COMPONENTS.PROBE])
        alert.pushAlert("Reflection captures need to be rebuilt",  "alert")
}