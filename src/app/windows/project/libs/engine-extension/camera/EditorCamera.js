import {mat4, quat} from "gl-matrix"
import CameraPostProcessing from "../../engine/libs/basic/CameraPostProcessing";

export default class EditorCamera extends CameraPostProcessing{
    radius = 25
    centerOn = [0, 0, 0]
    ortho = false 
    position = [0, 0, 0]
    yaw = 0
    pitch = 0
    #aspectRatio = 1
    direction = {}
    #fov = Math.PI / 2
    projectionMatrix = mat4.create()
    invProjectionMatrix = mat4.create()
    viewMatrix = mat4.create()
    invViewMatrix =  mat4.create()
    animated = true
    gizmoReference

    constructor() {
        super()
        this.pitch = .5
        this.yaw = .5
        this.updateViewMatrix()
    }
    get orientation() {
        const pQuat = quat.fromEuler([], this.pitch * 57.25, 0, 0)
        const yQuat = quat.fromEuler([], 0, this.yaw * 57.25, 0)

        return quat.multiply([], yQuat, pQuat)
    }
    getNotTranslatedViewMatrix() {
        let m = [...this.viewMatrix].flat()
        m[12] = m[13] = m[14] = 0
        return m
    }
    get fov() {
        return this.#fov
    }
    set fov(data) {
        this.#fov = data
        this.updateProjection()
    }
    get aspectRatio() {
        return this.#aspectRatio
    }
    set aspectRatio(data) {
        this.#aspectRatio = data
        this.updateProjection()
    }


    updateProjection() {
        if (this.ortho)
            mat4.ortho(this.projectionMatrix, -this.radius, this.radius, -this.radius / this.#aspectRatio, this.radius / this.#aspectRatio, this.zNear, this.zFar)
        else
            mat4.perspective(this.projectionMatrix, this.#fov, this.#aspectRatio, this.zNear, this.zFar)


        mat4.invert(this.invProjectionMatrix, this.projectionMatrix)
    }


    updateViewMatrix() {

        if (this.pitch > Math.PI / 2)
            this.pitch = Math.PI / 2
        if (this.pitch < -Math.PI / 2)
            this.pitch = -Math.PI / 2
        const cosPitch = Math.cos(this.pitch)

        this.position[0] = this.radius * cosPitch * Math.cos(this.yaw) + this.centerOn[0]
        this.position[1] = this.radius * Math.sin(this.pitch) + this.centerOn[1]
        this.position[2] = this.radius * cosPitch * Math.sin(this.yaw) + this.centerOn[2]
        mat4.lookAt(this.viewMatrix, this.position, this.centerOn, [0, 1, 0])
        mat4.invert(this.invViewMatrix, this.viewMatrix)
        if (this.ortho)
            this.updateProjection()
    }
    static update(pitch, yaw,  radius, centerOn){
        const position = []
        const cosPitch = Math.cos(pitch)
        position[0] = radius * cosPitch * Math.cos(yaw) + centerOn[0]
        position[1] = radius * Math.sin(pitch) + centerOn[1]
        position[2] = radius * cosPitch * Math.sin(yaw) + centerOn[2]
        return [mat4.lookAt([], position, centerOn, [0, 1, 0]), position]
    }
}

