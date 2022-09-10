import COMPONENTS from "../../../../../../../public/engine/production/data/COMPONENTS";

export default function  updateTransformation(axis, data, key, entity) {
    const prev = entity[key]
    entity[key] = [
        axis === "x" ? data : prev[0],
        axis === "y" ? data : prev[1],
        axis === "z" ? data : prev[2]
    ]

    if (entity.components[COMPONENTS.POINT_LIGHT])
        entity.components[COMPONENTS.POINT_LIGHT].changed = true
    if (entity.components[COMPONENTS.PROBE])
        alert.pushAlert("Reflection captures need to be rebuilt",  "alert")
}