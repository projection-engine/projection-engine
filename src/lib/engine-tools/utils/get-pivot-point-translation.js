import {vec4} from "gl-matrix";

export default function getPivotPointTranslation(entity) {
    const p = entity.pivotPoint
    const a = entity.absoluteTranslation
    if(!entity.__pivotOffset)
        entity.__pivotOffset = [0,0,0]
    vec4.add(entity.__pivotOffset, a, p)

}