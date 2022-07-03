import ShaderInstance from "../../engine/instances/ShaderInstance"
import * as gizmoShaderCode from "../shaders/GIZMO.glsl"

import {mat4, quat, vec3} from "gl-matrix"
import Entity from "../../engine/basic/Entity"
import TransformComponent from "../../engine/components/TransformComponent"
import MeshInstance from "../../engine/instances/MeshInstance"
import Transformation from "../../engine/utils/Transformation"
import PickComponent from "../../engine/components/PickComponent"
import TextureInstance from "../../engine/instances/TextureInstance"
import circle from "../../../static/icons/circle.png"
import ROTATION_TYPES from "../../../static/misc/ROTATION_TYPES"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import Conversion from "../../engine/utils/Conversion"

const toDeg = 57.29, toRad = 3.1415 / 180
export default class RotationGizmo {
    pivotPoint = [0,10,0,0]
    clickedAxis = -1
    tracking = false
    currentRotation = [0, 0, 0]
    gridSize = .01
    distanceX = 0
    distanceY = 0
    distanceZ = 0

    constructor(renderTarget, resolution, sys) {
        this.sys = sys
        this.renderTarget = renderTarget
        this.resolution = resolution
        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertexRot, gizmoShaderCode.fragmentRot, gpu)
        this.xGizmo = this._mapEntity(2, "x")
        this.yGizmo = this._mapEntity(3, "y")
        this.zGizmo = this._mapEntity(4, "z")

        import("../../../static/meshes/Circle.json")
            .then(res => {
                this.xyz = new MeshInstance({
                    vertices: res.vertices,
                    indices: res.indices,
                    normals: [],
                    uvs: res.uvs,
                    tangents: [],
                })
            })

        this.texture = new TextureInstance(circle, false)
    }

    _mapEntity(i, axis) {
        const e = new Entity(undefined)
        e.components[COMPONENTS.PICK] = new PickComponent(undefined, i - 3)
        e.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        let s, t = [0, 0, 0], r
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

        default:
            break
        }
        e.components[COMPONENTS.TRANSFORM].translation = t
        e.components[COMPONENTS.TRANSFORM].rotation = r
        e.components[COMPONENTS.TRANSFORM].transformationMatrix = Transformation.transform(t, r, s)

        return e
    }

    onMouseDown(event) {
        if (event.target === window.gpu.canvas && !this.firstPick) {
            const w = window.gpu.canvas.width, h = window.gpu.canvas.height
            const x = event.clientX
            const y = event.clientY

            this.currentCoord = Conversion.toQuadCoord({x, y}, {w, h}, window.gpu.canvas)
            this.currentCoord.clientX = event.clientX
            this.currentCoord.clientY = event.clientY
        }
        if (this.firstPick)
            this.firstPick = false

    }

    onMouseUp(force) {
        this.firstPick = true
        if (this.tracking || force === true) {
            this.renderTarget.innerText = ""

            this.started = false
            this.distanceX = 0
            this.distanceY = 0
            this.distanceZ = 0
            this.tracking = false
            this.clickedAxis = -1
            this.currentCoord = undefined
            document.exitPointerLock()
            this.currentRotation = [0, 0, 0]
            this.t = 0
            if(force !== true)
                this.onGizmoEnd()
        }
        this.renderTarget.style.display = "none"
    }

    onMouseMove(event) {
        if (!this.started) {
            this.started = true
            this.onGizmoStart()
        }

        switch (this.clickedAxis) {
        case 1: // x
            this.distanceX += Math.abs(event.movementX * 0.05)
            if (Math.abs(this.distanceX) >= this.gridSize) {
                this.rotateElement([Math.sign(event.movementX) * this.gridSize * toRad, 0, 0])
                this.distanceX = 0
                this.renderTarget.innerText = `${(this.currentRotation[0] * toDeg).toFixed(1)} θ`
            }
            break
        case 2: // y
            this.distanceY += Math.abs(event.movementX * 0.05)
            if (Math.abs(this.distanceY) >= this.gridSize) {
                this.rotateElement([0, Math.sign(event.movementX) * this.gridSize * toRad, 0])
                this.renderTarget.innerText = `${(this.currentRotation[1] * toDeg).toFixed(1)} θ`
                this.distanceY = 0
            }
            break
        case 3: // z
            this.distanceZ += Math.abs(event.movementX * 0.05)
            if (Math.abs(this.distanceZ) >= this.gridSize) {
                this.rotateElement([0, 0, Math.sign(event.movementX) * this.gridSize * toRad])

                this.distanceZ = 0
                this.renderTarget.innerText = `${(this.currentRotation[2] * toDeg).toFixed(1)} θ`
            }
            break
        }
    }

    rotateElement(vec) {
        let quatA = [0, 0, 0, 1]
        vec3.add(this.currentRotation, this.currentRotation, vec)
        if (vec[0] !== 0)
            quat.rotateX(quatA, quatA, vec[0])
        if (vec[1] !== 0)
            quat.rotateY(quatA, quatA, vec[1])
        if (vec[2] !== 0)
            quat.rotateZ(quatA, quatA, vec[2])

        const SIZE = this.target.length
        for (let i = 0; i < SIZE; i++) {
            const target = this.target[i].components[COMPONENTS.TRANSFORM]
            if (this.typeRot === ROTATION_TYPES.GLOBAL || SIZE > 1) {
                if(vec3.len(target.pivotPoint) > 0) {
                    const rotationMatrix = mat4.fromQuat([], quatA),
                        translated = vec3.sub([], target.translation, target.pivotPoint)
                    target.translation = vec3.add([], vec3.transformMat4([], translated, rotationMatrix), target.pivotPoint)
                }
                target.rotationQuat = quat.multiply([], quatA, target.rotationQuat)
            }
            else
                target.rotationQuat = quat.multiply([], target.rotationQuat, quatA)
        }
    }

    getTranslation(el) {
        const comp = el.components[COMPONENTS.TRANSFORM]
        if (comp) {
            const m = comp.transformationMatrix
            return {
                valid: true,
                data: [m[12], m[13], m[14]]
            }
        }
        return {
            valid: false,
            data: [0, 0, 0]
        }
    }

    #testClick(el, camera,  selected, entities, translation ) {
        const r = el.components[COMPONENTS.TRANSFORM].rotationQuat
        const mX = this.#rotateMatrix(translation, r, "x", this.xGizmo.components[COMPONENTS.TRANSFORM])
        const mY = this.#rotateMatrix(translation, r, "y", this.yGizmo.components[COMPONENTS.TRANSFORM])
        const mZ = this.#rotateMatrix(translation, r, "z", this.zGizmo.components[COMPONENTS.TRANSFORM])

        const FBO = this.sys.drawToDepthSampler(
            this.xyz,
            camera.viewMatrix,
            camera.projectionMatrix,
            [mX, mY, mZ],
            camera.position,
            translation,
            camera.ortho
        )
        const dd = window.renderer.picking.depthPick(FBO, this.currentCoord)
        const pickID = Math.round(255 * (dd[0]))
        this.clickedAxis = pickID

        if (pickID === 0) {
            this.onMouseUp(true)
            this.setSelected([])
        } else {
            this.tracking = true

            this.renderTarget.style.left = this.currentCoord.clientX + "px"
            this.renderTarget.style.top = this.currentCoord.clientY + "px"
            this.renderTarget.style.display = "block"
            this.renderTarget.style.width = "fit-content"
            this.renderTarget.innerText = "0 θ"
            this.target = selected

            window.gpu.canvas.requestPointerLock()
        }
    }

    execute(
        meshes,
        meshesMap,
        selected,
        camera,
        entities,
        transformationType,
        onGizmoStart,
        onGizmoEnd,
        gridSize,
        setSelected
    ) {
        if (selected.length > 0) {
            this.setSelected = setSelected
            const el = selected[0]
            const parent = entities[el.linkedTo]
            const currentTranslation = this.getTranslation(el),
                parentTranslation = parent ? this.getTranslation(parent) : {data: [0, 0, 0]},
                translation = currentTranslation.valid ? [
                    currentTranslation.data[0] + parentTranslation.data[0],
                    currentTranslation.data[1] + parentTranslation.data[1],
                    currentTranslation.data[2] + parentTranslation.data[2]
                ] : undefined
            if (translation) {
                this.gridSize = gridSize
                this.firstPick = false
                this.typeRot = transformationType
                this.camera = camera
                this.onGizmoStart = onGizmoStart
                this.onGizmoEnd = onGizmoEnd
                if (this.currentCoord && !this.tracking)
                    this.#testClick(el,  camera, selected, entities, translation)
                this.#drawGizmo(translation, el.components[COMPONENTS.TRANSFORM].rotationQuat, camera.viewMatrix, camera.projectionMatrix, this.gizmoShader)
            }
        }
    }

    #rotateMatrix(t, rotation, axis, comp) {
        const matrix = [...comp.transformationMatrix]
        matrix[12] += t[0]
        matrix[13] += t[1]
        matrix[14] += t[2]
        if (this.typeRot === ROTATION_TYPES.GLOBAL && axis !== undefined) {
            switch (axis) {
            case "x":
                mat4.rotateY(matrix, matrix, -this.currentRotation[0])
                break
            case "y":
                mat4.rotateY(matrix, matrix, this.currentRotation[1])
                break
            case "z":
                mat4.rotateY(matrix, matrix, this.currentRotation[2])
                break
            default:
                break
            }
        } else if (axis !== undefined)
            return mat4.fromRotationTranslationScale([], quat.multiply([], rotation, comp.rotationQuat), t, comp.scaling)

        return matrix
    }

    #drawGizmo(translation, rotation, view, proj, shader) {
        if (this.xyz) {
            window.gpu.clear(window.gpu.DEPTH_BUFFER_BIT)
            window.gpu.disable(window.gpu.CULL_FACE)

            const mX = this.#rotateMatrix(translation, rotation, "x", this.xGizmo.components[COMPONENTS.TRANSFORM])
            const mY = this.#rotateMatrix(translation, rotation, "y", this.yGizmo.components[COMPONENTS.TRANSFORM])
            const mZ = this.#rotateMatrix(translation, rotation, "z", this.zGizmo.components[COMPONENTS.TRANSFORM])

            shader.use()
            window.gpu.bindVertexArray(this.xyz.VAO)
            window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, this.xyz.indexVBO)
            this.xyz.vertexVBO.enable()
            this.xyz.uvVBO.enable()

            if (this.tracking && this.clickedAxis === 1 || !this.tracking)
                this.#draw(view, mX, proj, 1, this.xGizmo.components[COMPONENTS.PICK].pickID, shader, translation)
            if (this.tracking && this.clickedAxis === 2 || !this.tracking)
                this.#draw(view, mY, proj, 2, this.yGizmo.components[COMPONENTS.PICK].pickID, shader, translation)
            if (this.tracking && this.clickedAxis === 3 || !this.tracking)
                this.#draw(view, mZ, proj, 3, this.zGizmo.components[COMPONENTS.PICK].pickID, shader, translation)

            this.xyz.vertexVBO.disable()
            window.gpu.bindVertexArray(null)
            window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, null)
            window.gpu.enable(window.gpu.CULL_FACE)
        }
    }

    #draw(view, t, proj, a, id, shader, tt) {
        shader.bindForUse({
            viewMatrix: view,
            transformMatrix: t,
            projectionMatrix: proj,
            axis: a,
            translation: tt,
            camPos: this.camera.position,
            uID: [...id, 1],
            selectedAxis: this.clickedAxis,
            circleSampler: this.texture.texture,
            cameraIsOrthographic: this.camera.ortho
        })
        window.gpu.drawElements(window.gpu.TRIANGLES, this.xyz.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
    }
}
