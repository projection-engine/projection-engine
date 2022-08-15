import ShaderInstance from "../../../engine/libs/instances/ShaderInstance"
import * as gizmoShaderCode from "../../templates/shaders/GIZMO.glsl"

import {mat4, quat, vec3} from "gl-matrix"
import MeshInstance from "../../../engine/libs/instances/MeshInstance"
import TextureInstance from "../../../engine/libs/instances/TextureInstance"
import circle from "../../../../data/icons/circle.png"
import TRANSFORMATION_TYPE from "../../../../data/misc/TRANSFORMATION_TYPE"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import Conversion from "../../../engine/services/Conversion"
import getEntityTranslation from "./utils/get-entity-translation"
import mapEntity from "./utils/map-entity"
import mesh from "../../data/ROTATION_GIZMO.json"
import RendererStoreController from "../../../../stores/RendererStoreController";
import ViewportPicker from "../../../engine/services/ViewportPicker";
import EngineLoop from "../../../engine/libs/loop/EngineLoop";

const CSS = {
    backdropFilter: "blur(10px) brightness(70%)",
    borderRadius: "5px",
    width: "fit-content",
    height: "fit-content",
    position: "absolute",
    top: "4px",
    left: "4px",
    zIndex: "10",
    color: "white",
    padding: "8px",
    fontSize: ".75rem",
    display: "none"
}
let transformationSystem
const toDeg = 57.29, toRad = 3.1415 / 180
export default class Rotation {
    clickedAxis = -1
    tracking = false
    currentRotation = [0, 0, 0]
    gridSize = .1
    distanceX = 0
    distanceY = 0
    distanceZ = 0
    translation = undefined
    targetRotation = undefined
    mainEntity = undefined
    targetEntities = []
    started = false

    constructor(sys) {

        const targetID = gpu.canvas.id + "-gizmo"
        if (document.getElementById(targetID) !== null)
            this.renderTarget = document.getElementById(targetID)
        else {
            this.renderTarget = document.createElement("div")
            this.renderTarget.id = targetID
            Object.assign(this.renderTarget.style, CSS)
            document.body.appendChild(this.renderTarget)
        }

        this.drawID = (...params) => sys.drawToDepthSampler(...params)

        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertexRot, gizmoShaderCode.fragmentRot, gpu)
        this.xGizmo = mapEntity("x", "ROTATION")
        this.yGizmo = mapEntity("y", "ROTATION")
        this.zGizmo = mapEntity("z", "ROTATION")

        this.xyz = new MeshInstance({
            vertices: mesh.vertices,
            indices: mesh.indices,
            normals: [],
            uvs: mesh.uvs,
            tangents: [],
        })

        this.texture = new TextureInstance(circle, false)
    }

    onMouseDown(event) {
        const w = gpu.canvas.width, h = gpu.canvas.height
        const x = event.clientX
        const y = event.clientY

        this.currentCoord = Conversion.toQuadCoord({x, y}, {w, h}, gpu.canvas)
        this.currentCoord.clientX = event.clientX
        this.currentCoord.clientY = event.clientY
        this.#testClick()
    }

    onMouseUp() {
        RendererStoreController.saveEntity(
            this.mainEntity.id,
            COMPONENTS.TRANSFORM,
            "rotationQuat",
            this.mainEntity.components[COMPONENTS.TRANSFORM].rotationQuat
        )
        document.exitPointerLock()

        this.started = false
        this.distanceX = 0
        this.distanceY = 0
        this.distanceZ = 0
        this.clickedAxis = -1
        this.tracking = false
        this.currentRotation = [0, 0, 0]
        this.renderTarget.innerText = ""
        this.renderTarget.style.display = "none"
    }

    exit() {
        this.tracking = false
        this.targetEntities = []
        this.mainEntity = undefined
        this.translation = undefined
        this.targetRotation = undefined
    }

    onMouseMove(event) {
        if(!this.started){
            this.started = true
            RendererStoreController.saveEntity(
                this.mainEntity.id,
                COMPONENTS.TRANSFORM,
                "rotationQuat",
                this.mainEntity.components[COMPONENTS.TRANSFORM].rotationQuat
            )
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
        const quatA = [0, 0, 0, 1]
        vec3.add(this.currentRotation, this.currentRotation, vec)
        if (vec[0] !== 0)
            quat.rotateX(quatA, quatA, vec[0])
        if (vec[1] !== 0)
            quat.rotateY(quatA, quatA, vec[1])
        if (vec[2] !== 0)
            quat.rotateZ(quatA, quatA, vec[2])

        const SIZE = this.targetEntities.length
        for (let i = 0; i < SIZE; i++) {
            const target = this.targetEntities[i].components[COMPONENTS.TRANSFORM]
            if (this.transformationType === TRANSFORMATION_TYPE.GLOBAL || SIZE > 1) {
                if (vec3.len(target.pivotPoint) > 0) {
                    const rotationMatrix = mat4.fromQuat([], quatA),
                        translated = vec3.sub([], target.translation, target.pivotPoint)
                    target.translation = vec3.add([], vec3.transformMat4([], translated, rotationMatrix), target.pivotPoint)
                }
                target.rotationQuat = quat.multiply([], quatA, target.rotationQuat)
            } else
                target.rotationQuat = quat.multiply([], target.rotationQuat, quatA)
        }
    }


    #testClick() {
        if (!this.mainEntity || !this.mainEntity.components[COMPONENTS.TRANSFORM])
            return
        const camera = window.renderer.camera
        const mX = this.#rotateMatrix("x", this.xGizmo.components[COMPONENTS.TRANSFORM])
        const mY = this.#rotateMatrix("y", this.yGizmo.components[COMPONENTS.TRANSFORM])
        const mZ = this.#rotateMatrix("z", this.zGizmo.components[COMPONENTS.TRANSFORM])

        const FBO = this.drawID(
            this.xyz,
            camera.viewMatrix,
            camera.projectionMatrix,
            [mX, mY, mZ],
            camera.position,
            this.translation,
            camera.ortho
        )
        const dd = ViewportPicker.depthPick(FBO, this.currentCoord)
        const pickID = Math.round(255 * dd[0])

        this.clickedAxis = pickID

        if (pickID === 0)
            this.onMouseUp(true)
        else if (pickID > 0) {
            this.tracking = true

            this.renderTarget.style.left = this.currentCoord.clientX + "px"
            this.renderTarget.style.top = this.currentCoord.clientY + "px"
            this.renderTarget.style.display = "block"
            this.renderTarget.style.width = "fit-content"
            this.renderTarget.innerText = "0 θ"

            gpu.canvas.requestPointerLock()
        }
    }

    execute(
        meshes,
        meshesMap,
        selected,
        transformationType
    ) {
        if (!transformationSystem)
            transformationSystem = EngineLoop.miscMap.get("transformations")
        if(!selected[0]) {
            this.mainEntity = undefined
            return
        }
        this.transformationType = transformationType
        if (!this.translation || transformationSystem.hasUpdatedItem || this.mainEntity !== selected[0]) {
            this.targetEntities = selected
            this.mainEntity = selected[0]
            this.translation = getEntityTranslation(this.mainEntity)
            if (this.translation) {
                const t = this.mainEntity.components[COMPONENTS.TRANSFORM]
                this.targetRotation = t !== undefined ? t.rotationQuat : [0, 0, 0, 1]
            }
        }

        if (this.translation && this.mainEntity === selected[0])
            this.#drawGizmo()
    }

    #rotateMatrix(axis, comp) {
        const matrix = comp.transformationMatrix.slice(0)
        matrix[12] += this.translation[0]
        matrix[13] += this.translation[1]
        matrix[14] += this.translation[2]
        if (this.transformationType === TRANSFORMATION_TYPE.GLOBAL && axis !== undefined) {
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
            return mat4.fromRotationTranslationScale([], quat.multiply([], this.targetRotation, comp.rotationQuat), this.translation, comp.scaling)

        return matrix
    }

    #drawGizmo() {
        gpu.clear(gpu.DEPTH_BUFFER_BIT)
        gpu.disable(gpu.CULL_FACE)

        const mX = this.#rotateMatrix("x", this.xGizmo.components[COMPONENTS.TRANSFORM])
        const mY = this.#rotateMatrix("y", this.yGizmo.components[COMPONENTS.TRANSFORM])
        const mZ = this.#rotateMatrix("z", this.zGizmo.components[COMPONENTS.TRANSFORM])

        this.gizmoShader.use()
        gpu.bindVertexArray(this.xyz.VAO)
        gpu.bindBuffer(gpu.ELEMENT_ARRAY_BUFFER, this.xyz.indexVBO)
        this.xyz.vertexVBO.enable()
        this.xyz.uvVBO.enable()

        if (this.tracking && this.clickedAxis === 1 || !this.tracking)
            this.#draw(mX, 1, this.xGizmo.components[COMPONENTS.PICK].pickID)
        if (this.tracking && this.clickedAxis === 2 || !this.tracking)
            this.#draw(mY, 2, this.yGizmo.components[COMPONENTS.PICK].pickID)
        if (this.tracking && this.clickedAxis === 3 || !this.tracking)
            this.#draw(mZ, 3, this.zGizmo.components[COMPONENTS.PICK].pickID)

        this.xyz.vertexVBO.disable()
        gpu.bindVertexArray(null)
        gpu.bindBuffer(gpu.ELEMENT_ARRAY_BUFFER, null)
        gpu.enable(gpu.CULL_FACE)
    }

    #draw(t, axis, id) {
        const camera = window.renderer.camera
        this.gizmoShader.bindForUse({
            viewMatrix: camera.viewMatrix,
            transformMatrix: t,
            projectionMatrix: camera.projectionMatrix,
            axis,
            translation: this.translation,
            camPos: camera.position,
            uID: [...id, 1],
            selectedAxis: this.clickedAxis,
            circleSampler: this.texture.texture,
            cameraIsOrthographic: camera.ortho
        })
        gpu.drawElements(gpu.TRIANGLES, this.xyz.verticesQuantity, gpu.UNSIGNED_INT, 0)
    }
}
