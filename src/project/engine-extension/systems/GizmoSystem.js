import Translation from "../gizmo/Translation"
import Rotation from "../gizmo/Rotation"
import GIZMOS from "../../static/misc/GIZMOS"
import Scale from "../gizmo/Scale"
import TRANSFORMATION_TYPE from "../../static/misc/TRANSFORMATION_TYPE"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import * as gizmoShaderCode from "../shaders/GIZMO.glsl"
import Tooltip from "../gizmo/Tooltip"
import generateNextID from "../../engine/utils/generateNextID"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import * as shaderCode from "../../engine/shaders/PICK.glsl"

function move(event) {
    const canvas = event.target
    if (canvas.targetGizmo)
        canvas.targetGizmo.onMouseMove(event)
}

const LEFT_BUTTON = 0
let gpu, depthSystem
export default class GizmoSystem {
    targetGizmo
    selectedEntities = []
    selectedHash = ""
    lastGizmo = GIZMOS.TRANSLATION
    constructor() {
        gpu = window.gpu

        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertex, gizmoShaderCode.fragment)
        this.tooltip = new Tooltip()

        this.translationGizmo = new Translation(this)
        this.scaleGizmo = new Scale(this)
        this.rotationGizmo = new Rotation(this)

        this.handlerListener = this.handler.bind(this)
        gpu.canvas.addEventListener("mouseup", this.handlerListener)
        gpu.canvas.addEventListener("mousedown", this.handlerListener)

        this.shaderSameSize = new ShaderInstance(shaderCode.sameSizeVertex, shaderCode.fragment)

    }

    handler(event) {
        switch (event.type) {
        case "mousedown":
            if (event.button === LEFT_BUTTON) {
                if (this.targetGizmo) {
                    this.targetGizmo.onMouseDown(event)
                    gpu.canvas.addEventListener("mousemove", move)
                }
                gpu.canvas.targetGizmo = this.targetGizmo
            }
            break
        case "mouseup":
            if (this.targetGizmo)
                this.targetGizmo.onMouseUp(event)
            this.targetGizmo = undefined
            this.tooltip.stop()
            gpu.canvas.removeEventListener("mousemove", move)
            break
        default:
            break
        }
    }

    drawToDepthSampler(
        mesh,
        view,
        projection,
        transforms,
        camPos,
        translation,
        cameraIsOrthographic
    ) {
        depthSystem.frameBuffer.startMapping()
        this.shaderSameSize.use()
        mesh.use()
        gpu.disable(gpu.CULL_FACE)
        for (let i = 0; i < transforms.length; i++) {
            this.shaderSameSize.bindForUse({
                viewMatrix: view,
                transformMatrix: transforms[i],
                projectionMatrix: projection,
                uID: [...generateNextID(i + 1), 1.],
                camPos,
                translation,
                cameraIsOrthographic
            })
            gpu.drawElements(gpu.TRIANGLES, mesh.verticesQuantity, gpu.UNSIGNED_INT, 0)
        }
        gpu.enable(gpu.CULL_FACE)
        mesh.finish()
        depthSystem.frameBuffer.stopMapping()
        return depthSystem.frameBuffer
    }

    execute(
        meshes,
        meshesMap,
        selected,
        camera,
        entities,
        gizmo,
        transformationType = TRANSFORMATION_TYPE.GLOBAL,
        onGizmoStart,
        onGizmoEnd
    ) {
        if(!depthSystem)
            depthSystem = window.renderer.renderingPass.depthPrePass
        if (selected.length > 0){
            const JOINED = selected.join("-")
            if(this.selectedHash !== JOINED || this.lastGizmo !== gizmo) {
                this.lastGizmo = gizmo
                this.selectedEntities = selected
                    .map(s => entities.get(s))
                    .filter(c =>c &&( gizmo === GIZMOS.TRANSLATION || c.components[COMPONENTS.TRANSFORM] && (gizmo === GIZMOS.ROTATION && !c.components[COMPONENTS.TRANSFORM].lockedRotation || gizmo === GIZMOS.SCALE && !c.components[COMPONENTS.TRANSFORM]?.lockedScaling)))
                this.selectedHash = JOINED
            }

            switch (gizmo) {
            case GIZMOS.TRANSLATION:
                this.targetGizmo = this.translationGizmo
                this.translationGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,   entities, transformationType, onGizmoStart, onGizmoEnd)
                break
            case GIZMOS.ROTATION:
                this.targetGizmo = this.rotationGizmo
                this.rotationGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,  entities, transformationType, onGizmoStart, onGizmoEnd)
                break
            case GIZMOS.SCALE:
                this.targetGizmo = this.scaleGizmo
                this.scaleGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,   entities, transformationType, onGizmoStart, onGizmoEnd)
                break
            }
        }
        else if(this.targetGizmo || this.selectedEntities.length > 0) {
            this.targetGizmo = undefined
            this.selectedHash = ""
            this.selectedEntities = []
        }
    }
}
