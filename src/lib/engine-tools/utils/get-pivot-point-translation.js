import {vec3, vec4} from "gl-matrix";

export default function getPivotPointTranslation(entity) {
    const p = entity.pivotPoint
    const a = entity._translation
    if(!entity.__pivotOffset)
        entity.__pivotOffset = [0,0,0]
    vec3.add(entity.__pivotOffset, a, p)

}