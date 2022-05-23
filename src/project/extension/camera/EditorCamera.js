import {mat4, quat} from "gl-matrix";

const toRad = Math.PI / 180
export default class EditorCamera {
    _radius = 25
    centerOn = [0, 0, 0]
    ortho = false
    locked = false
    #position = [0, 0, 0]
    #yaw = 0
    #pitch = 0

    direction = {}
    #fov = Math.PI / 2
    projectionMatrix = mat4.create()

    viewMatrix = mat4.create()

    constructor(origin = [0, 0, 0], fov, zNear, zFar, aspectRatio = 1, yaw, pitch) {
        this.#fov = 60 * toRad
        this.#position = origin
        this._zNear = zNear
        this._zFar = zFar
        this.aspectRatio = aspectRatio
        this.#pitch = .5
        this.#yaw = .5
        if(yaw)
            this.yaw = yaw
        if(pitch)
            this.pitch = pitch
        this.updateViewMatrix()
    }


    get orientation() {
        const pQuat = quat.fromEuler([], this.pitch * 57.25, 0, 0)
        const yQuat = quat.fromEuler([], 0, this.yaw * 57.25, 0)

        return quat.multiply([], yQuat, pQuat)
    }


    get zNear() {
        return this._zNear
    }

    get zFar() {
        return this._zFar
    }

    set zNear(data) {
        this._zNear = data

    }

    set zFar(data) {
        this._zFar = data

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
        return this._aspectRatio
    }

    set aspectRatio(data) {
        this._aspectRatio = data
        this.updateProjection()
    }


    updateProjection() {
        if (this.ortho)
            mat4.ortho(this.projectionMatrix, -this._radius, this._radius, -this._radius / this._aspectRatio, this._radius / this._aspectRatio, this._zNear, this._zFar);
        else
            mat4.perspective(this.projectionMatrix, this.#fov, this._aspectRatio, this._zNear, this._zFar)
    }

    set position(data) {
        this.#position = data
        this.updateViewMatrix()
    }

    get position() {
        return this.#position
    }


    get yaw() {
        return this.#yaw
    }

    get pitch() {
        return this.#pitch
    }

    set yaw(data) {
        if (!this.locked)
            this.#yaw = data
    }

    set pitch(data) {
        if (!this.locked)
            this.#pitch = data
    }

    set radius(data) {
        this._radius = data
        this.updateViewMatrix()
    }


    get radius() {
        return this._radius
    }

    updateViewMatrix(ctrl) {
        console.log(ctrl)
        // if(ctrl) Spherical
        // else free
        if (this.#pitch > Math.PI / 2)
            this.#pitch = Math.PI / 2
        if (this.#pitch < -Math.PI / 2)
            this.#pitch = -Math.PI / 2
        const cosPitch = Math.cos(this.#pitch)

        this.#position[0] = this.radius * cosPitch * Math.cos(this.#yaw) + this.centerOn[0]
        this.#position[1] = this.radius * Math.sin(this.#pitch) + this.centerOn[1]
        this.#position[2] = this.radius * cosPitch * Math.sin(this.#yaw) + this.centerOn[2]
        mat4.lookAt(this.viewMatrix, this.#position, this.centerOn, [0, 1, 0])
        if (this.ortho)
            this.updateProjection()
    }
}

