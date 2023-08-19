import {mat4, quat, vec3} from "gl-matrix";

export default class GizmoEntity {
    pickID = vec3.create()
    matrix = mat4.create()
    rotationQuaternion = quat.create()
    translation = vec3.create()
    scaling = vec3.create()
}
