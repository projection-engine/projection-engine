import {mat4, quat, vec3} from "gl-matrix"
import COMPONENTS from "../../engine/data/COMPONENTS"
import TRANSFORMATION_TYPE from "../../../static/misc/TRANSFORMATION_TYPE"
import Conversion from "../../engine/services/Conversion"
import getEntityTranslation from "./getEntityTranslation"
import INFORMATION_CONTAINER from "../../../static/misc/INFORMATION_CONTAINER"
import DataStoreController from "../../../stores/DataStoreController";
import ViewportPicker from "../../engine/services/ViewportPicker";

let gpu
export default class Gizmo {
    target = []
    clickedAxis = -1
    tracking = false
    targetRotation = undefined

    distanceX = 0
    distanceY = 0
    distanceZ = 0
    xGizmo
    yGizmo
    zGizmo
    xyz
    gridSize
    totalMoved = 0

    started = false

    translation = undefined
    mainEntity = undefined
    targetEntities = []
    updateTransformationRealtime = false
    key

    constructor(sys) {

        gpu = window.gpu
        this.drawID = (...params) => sys.drawToDepthSampler(...params)
        this.renderTarget = document.getElementById(INFORMATION_CONTAINER.TRANSFORMATION)
        this.gizmoShader = sys.gizmoShader
    }

    onMouseMove(){
        if(!this.started){
            this.started = true
            DataStoreController.saveEntity(
                this.mainEntity.id,
                COMPONENTS.TRANSFORM,
                this.key,
                this.mainEntity.components[COMPONENTS.TRANSFORM][this.key]
            )
        }
    }

    onMouseDown(event) {
        if (!this.renderTarget)
            this.renderTarget = document.getElementById(INFORMATION_CONTAINER.TRANSFORMATION)
        const w = gpu.canvas.width, h = gpu.canvas.height
        const x = event.clientX
        const y = event.clientY

        this.currentCoord = Conversion.toQuadCoord({x, y}, {w, h}, gpu.canvas)
        this.currentCoord.clientX = event.clientX
        this.currentCoord.clientY = event.clientY
        this.#testClick()

    }
    notify(value, sign){
        this.totalMoved += sign * value
        this.renderTarget.innerText = this.totalMoved.toFixed(3) + " un"
    }
    onMouseUp() {
        if(this.totalMoved !== 0){
            DataStoreController.saveEntity(
                this.mainEntity.id,
                COMPONENTS.TRANSFORM,
                this.key,
                this.mainEntity.components[COMPONENTS.TRANSFORM][this.key]
            )
        }
        this.totalMoved = 0
        this.started = false
        document.exitPointerLock()
        this.distanceX = 0
        this.distanceY = 0
        this.distanceZ = 0
        this.clickedAxis = -1
        this.tracking = false
        this.renderTarget.style.display = "none"
    }

    exit() {
        this.tracking = false
        this.targetEntities = []
        this.mainEntity = undefined
        this.translation = undefined
        this.targetRotation = undefined
    }

    #testClick() {
        if(!this.mainEntity || this.mainEntity?.isFolder)
            return
        const camera = window.renderer.camera
        const mX = this.#translateMatrix(this.xGizmo.components)
        const mY = this.#translateMatrix(this.yGizmo.components)
        const mZ = this.#translateMatrix(this.zGizmo.components)
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
        const pickID = Math.round(255 * (dd[0]))
        this.clickedAxis = pickID

        if (pickID === 0)
            this.onMouseUp(true)
        else {

            this.tracking = true
            window.gpu.canvas.requestPointerLock()
            this.renderTarget.style.display = "block"
        }
    }


    execute(
        meshes,
        meshesMap,
        selected,
        transformationType
    ) {
        if(!selected[0]) {
            this.mainEntity = undefined
            return
        }
        this.transformationType = transformationType
        if (!this.translation || this.mainEntity !== selected[0]) {
            this.targetEntities = selected
            this.mainEntity = selected[0]
            this.translation = getEntityTranslation(this.mainEntity)
            if (this.translation) {
                const t = this.mainEntity.components[COMPONENTS.TRANSFORM]
                this.targetRotation = t !== undefined ? t.rotationQuat : [0, 0, 0, 1]
            }
        } else {
            if (this.updateTransformationRealtime)
                this.translation = getEntityTranslation(this.mainEntity)
            this.#drawGizmo()
        }
    }

    #translateMatrix(components) {
        const comp = components[COMPONENTS.TRANSFORM]
        const matrix = comp.transformationMatrix.slice(0)

        const translation = comp.translation,
            rotationQuat = comp.rotationQuat,
            scale = comp.scaling
        if (this.transformationType === TRANSFORMATION_TYPE.RELATIVE)
            mat4.fromRotationTranslationScaleOrigin(
                matrix,
                quat.multiply([], this.targetRotation, rotationQuat),
                vec3.add([], this.translation, translation),
                scale,
                translation
            )
        else {
            matrix[12] += this.translation[0]
            matrix[13] += this.translation[1]
            matrix[14] += this.translation[2]
        }

        return matrix
    }

    #drawGizmo() {

        const mX = this.#translateMatrix(this.xGizmo.components)
        const mY = this.#translateMatrix(this.yGizmo.components)
        const mZ = this.#translateMatrix(this.zGizmo.components)

        this.gizmoShader.use()
        window.gpu.bindVertexArray(this.xyz.VAO)
        window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, this.xyz.indexVBO)
        this.xyz.vertexVBO.enable()
        if (this.tracking && this.clickedAxis === 1 || !this.tracking)
            this.#draw(mX, 1, this.xGizmo.components[COMPONENTS.PICK].pickID)
        if (this.tracking && this.clickedAxis === 2 || !this.tracking)
            this.#draw(mY, 2, this.yGizmo.components[COMPONENTS.PICK].pickID)
        if (this.tracking && this.clickedAxis === 3 || !this.tracking)
            this.#draw(mZ, 3, this.zGizmo.components[COMPONENTS.PICK].pickID)

        this.xyz.vertexVBO.disable()
        window.gpu.bindVertexArray(null)
        window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, null)
    }

    #draw(t, axis, id) {
        const camera = window.renderer.camera
        this.gizmoShader.bindForUse({
            viewMatrix: camera.viewMatrix,
            transformMatrix: t,
            projectionMatrix: camera.projectionMatrix,
            camPos: camera.position,
            translation: this.translation,
            axis,
            selectedAxis: this.clickedAxis,
            uID: [...id, 1],
            cameraIsOrthographic: camera.ortho
        })
        window.gpu.drawElements(window.gpu.TRIANGLES, this.xyz.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
    }
}
