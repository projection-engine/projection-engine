import {vec3} from "gl-matrix";
import Entity from "../../engine-core/instances/Entity";

export default function getPivotPointTranslation(entity:Entity) {
    const p = entity.pivotPoint
    const a = entity.absoluteTranslation
    if(!entity.hasProperty("__pivotOffset"))
        entity.addProperty<Float32Array>("__pivotOffset", new Float32Array([0, 0, 0]))
    vec3.add(<Float32Array>entity.__pivotOffset, a, p)

}