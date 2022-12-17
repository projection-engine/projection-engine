import Entity from "../../engine-core/instances/Entity"
import TransformationAPI from "../../engine-core/lib/math/TransformationAPI"
import getPickerId from "../../engine-core/utils/get-picker-id";
import {mat4, quat, vec3} from "gl-matrix";

const toDeg = 57.29
export default function mapGizmoMesh(axis:string, type:string):Entity {
    const entity = new Entity()
    let s, t = [0, 0, 0], r, index
    switch (axis) {
        case "x":
            index = 2
            break
        case "y":
            index = 3
            break
        case "z":
            index = 4
            break
    }
    switch (type) {
        case  "TRANSLATION":
            switch (axis) {
                case "x":
                    s = [.75, 0.05, 0.05]
                    r = [0, 0, 0]
                    break
                case "y":
                    s = [.75, 0.05, 0.05]
                    r = [0, 0, 1.57]
                    break
                case "z":
                    s = [.75, 0.05, 0.05]
                    r = [Math.PI, -1.57, Math.PI]
                    break
            }
            break
        case "ROTATION":
            switch (axis) {
                case "x":
                    s = [1, .1, 1]
                    r = [0, 0, 1.57]
                    break
                case "y":
                    s = [1, .1, 1]
                    r = [0, 0, 0]
                    break
                case "z":
                    s = [1, .1, 1]
                    r = [1.57, 0, 0]
                    break
            }
            break
        case "SCALE":
            switch (axis) {
                case "x":
                    s = [.2, 0.2, 0.2]
                    r = [0, 1.57, 0]
                    break
                case "y":
                    s = [.2, 0.2, 0.2]
                    r = [-1.57, 1.57, 0]
                    break
                case "z":
                    s = [.2, 0.2, 0.2]
                    r = [Math.PI, -Math.PI, Math.PI]
                    break
            }
            break
        case "DUAL": {
            const SCALE = .5
            s = [SCALE, SCALE, SCALE]
            switch (axis) {
                case "XY":
                    r = [1.57, 0, 0]
                    break
                case "XZ":
                    r = [Math.PI, -1.57, Math.PI]

                    break
                case "ZY":
                    r = [0, Math.PI, -1.57]
                    break
            }
            break
        }
    }

    TransformationAPI.quat.fromEuler(<quat>entity._rotationQuat, toDeg * r[0], toDeg * r[1], toDeg * r[2])
    const pickID = getPickerId(index)
    entity.pickID[0] = pickID[0]
    entity.pickID[1] = pickID[1]
    entity.pickID[2] = pickID[2]
    TransformationAPI.vec3.copy(<vec3>entity._translation, <vec3>t)
    TransformationAPI.vec3.copy(<vec3>entity._scaling, <vec3>s)
    TransformationAPI.transformMovable(entity)

    const M = new Float32Array(16)
    mat4.copy(M, entity.matrix)

    entity.addProperty<Float32Array>("__cacheMatrix", M)

    return entity
}