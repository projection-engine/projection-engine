import {mat4, quat, vec3} from "gl-matrix"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import ROTATION_TYPES from "../../../static/misc/ROTATION_TYPES"
import Conversion from "../../engine/utils/Conversion"

export default class Gizmo {
    target = []
    clickedAxis = -1
    tracking = false
    rotationTarget = [0, 0, 0, 1]

    distanceX = 0
    distanceY = 0
    distanceZ = 0
    xGizmo
    yGizmo
    zGizmo
    constructor( gizmoShader, renderTarget, resolution, sys) {
        this.sys = sys
        this.renderTarget = renderTarget
        this.resolution = resolution
        this.gizmoShader = gizmoShader
    }

    onMouseDown(event) {
        if (event.target === window.gpu.canvas && !this.firstPick) {
            const w = window.gpu.canvas.width, h = window.gpu.canvas.height
            const x = event.clientX
            const y = event.clientY

            this.currentCoord = Conversion.toQuadCoord({x, y}, {w, h})
            this.currentCoord.clientX = x
            this.currentCoord.clientY = y
        }
        if (this.firstPick)
            this.firstPick = false
    }

    onMouseUp(force) {
        this.firstPick = true

        if (this.tracking || force === true) {
            this.tracking = false
            this.distanceX = 0
            this.distanceY = 0
            this.distanceZ = 0
            this.currentCoord = undefined
            document.exitPointerLock()
            this.clickedAxis = -1
            this.t = 0
            if(force !== true)
                this.onGizmoEnd()
        }
        this.renderTarget.stop()
    }

    transformElement() {
    }

    getTranslation(el) {
        const k = Object.keys(el.components)
        for (let i = 0; i < k.length; i++) {
            switch (k[i]) {
            case COMPONENTS.DIRECTIONAL_LIGHT:
                return {
                    valid: true,
                    data: el.components[k[i]].direction
                }
            case COMPONENTS.TRANSFORM:
                return {
                    valid: true,
                    data: el.components[COMPONENTS.TRANSFORM].centerOrigin
                }
            default:
                break
            }
        }
        return {
            valid: false,
            data: [0, 0, 0]
        }
    }

    #testClick(arrow, translation, onGizmoStart, selected) {
        const mX = this._translateMatrix(translation, this.xGizmo.components)
        const mY = this._translateMatrix(translation, this.yGizmo.components)
        const mZ = this._translateMatrix(translation, this.zGizmo.components)
        const FBO = this.sys.drawToDepthSampler(
            arrow,
            this.camera.viewMatrix,
            this.camera.projectionMatrix,
            [mX, mY, mZ],
            this.camera.position,
            translation,
            this.camera.ortho
        )
        const dd = window.renderer.picking.depthPick(FBO, this.currentCoord)
        const pickID = Math.round(255 * (dd[0]))
        this.clickedAxis = pickID

        if (pickID === 0) {
            this.onMouseUp(true)
            this.setSelected([])
        }
        else {
            this.tracking = true
            this.target = selected
            window.gpu.canvas.requestPointerLock()
            this.renderTarget.start()
            onGizmoStart()
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
        arrow,
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
                this.camera = camera
                this.typeRot = transformationType

                this.onGizmoEnd = onGizmoEnd
                if (this.currentCoord && !this.tracking)
                    this.#testClick(arrow, translation, onGizmoStart, selected, entities)
                const t = el.components[COMPONENTS.TRANSFORM]
                this.rotationTarget = t !== undefined ? t.rotationQuat : [0, 0, 0, 1]
                this.#drawGizmo(translation, camera.viewMatrix, camera.projectionMatrix, this.gizmoShader, arrow)
            }
        }

    }

    _translateMatrix(t, components) {
        const comp = components[COMPONENTS.TRANSFORM]
        const matrix = comp ? [...comp.transformationMatrix] : this.getLightData("transformationMatrix", components)

        const translation = comp ? comp.translation : this.getLightData("direction", components),
            rotationQuat = comp ? comp.rotationQuat : [0, 0, 0, 1],
            scale = comp ? comp.scaling : [1, 1, 1]
        if (this.typeRot === ROTATION_TYPES.RELATIVE) {
            mat4.fromRotationTranslationScaleOrigin(matrix, quat.multiply([], this.rotationTarget, rotationQuat), vec3.add([], t, translation), scale, translation)
        } else {
            matrix[12] += t[0]
            matrix[13] += t[1]
            matrix[14] += t[2]
        }

        return matrix
    }

    getLightData(key, components) {
        const dir = components[COMPONENTS.DIRECTIONAL_LIGHT]
        if(dir)
            return dir[key]
        return undefined
    }

    #drawGizmo(translation, view, proj, shader, arrow) {

        const mX = this._translateMatrix(translation, this.xGizmo.components)
        const mY = this._translateMatrix(translation, this.yGizmo.components)
        const mZ = this._translateMatrix(translation, this.zGizmo.components)

        shader.use()
        window.gpu.bindVertexArray(arrow.VAO)
        window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, arrow.indexVBO)
        arrow.vertexVBO.enable()

        if (this.tracking && this.clickedAxis === 1 || !this.tracking)
            this._draw(view, mX, proj, 1, this.xGizmo.components[COMPONENTS.PICK].pickID, shader, translation, arrow)
        if (this.tracking && this.clickedAxis === 2 || !this.tracking)
            this._draw(view, mY, proj, 2, this.yGizmo.components[COMPONENTS.PICK].pickID, shader, translation, arrow)
        if (this.tracking && this.clickedAxis === 3 || !this.tracking)
            this._draw(view, mZ, proj, 3, this.zGizmo.components[COMPONENTS.PICK].pickID, shader, translation, arrow)

        arrow.vertexVBO.disable()
        window.gpu.bindVertexArray(null)
        window.gpu.bindBuffer(window.gpu.ELEMENT_ARRAY_BUFFER, null)
    }

    _draw(view, t, proj, a, id, shader, tt, arrow) {
        shader.bindForUse({
            viewMatrix: view,
            transformMatrix: t,
            projectionMatrix: proj,
            camPos: this.camera.position,
            translation: tt,
            axis: a,
            selectedAxis: this.clickedAxis,
            uID: [...id, 1],
            cameraIsOrthographic: this.camera.ortho
        })
        window.gpu.drawElements(window.gpu.TRIANGLES, arrow.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
    }
}
