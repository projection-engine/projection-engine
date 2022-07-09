import System from "../../engine/basic/System"
import TranslationGizmo from "../gizmo/TranslationGizmo"
import RotationGizmo from "../gizmo/RotationGizmo"
import GIZMOS from "../../../static/misc/GIZMOS"
import ScaleGizmo from "../gizmo/ScaleGizmo"
import ROTATION_TYPES from "../../../static/misc/ROTATION_TYPES"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import * as gizmoShaderCode from "../shaders/GIZMO.glsl"
import TransformationTooltip from "../gizmo/TransformationTooltip"
import generateNextID from "../../engine/utils/generateNextID"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import FramebufferInstance from "../../engine/instances/FramebufferInstance"

function move(event) {
    const canvas = event.target
    if (canvas.targetGizmo)
        canvas.targetGizmo.onMouseMove(event)
}

const LEFT_BUTTON = 0

export default class GizmoSystem extends System {
    targetGizmo
    selectedEntities = []
    selectedHash = ""
    lastGizmo = GIZMOS.TRANSLATION
    constructor(resolution) {
        super() 
        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertex, gizmoShaderCode.fragment)
        const gpu = window.gpu
        this.frameBuffer = new FramebufferInstance(resolution.w, resolution.h)
            .texture()
            .depthTest()
        const targetID = gpu.canvas.id + "-gizmo"
        if (document.getElementById(targetID) !== null)
            this.renderTarget = document.getElementById(targetID)
        else {
            this.renderTarget = document.createElement("div")
            this.renderTarget.id = targetID
            Object.assign(this.renderTarget.style, {
                backdropFilter: "blur(10px) brightness(70%)", borderRadius: "5px", width: "fit-content",
                height: "fit-content", position: "absolute", top: "4px", left: "4px", zIndex: "10",
                color: "white", padding: "8px", fontSize: ".75rem",
                display: "none"
            })
            document.body.appendChild(this.renderTarget)
        }
        this.gizmoTooltip = new TransformationTooltip(this.renderTarget)
        this.translationGizmo = new TranslationGizmo( this.gizmoShader, this.gizmoTooltip, resolution, this)
        this.scaleGizmo = new ScaleGizmo( this.gizmoShader, this.gizmoTooltip, resolution, this)
        this.rotationGizmo = new RotationGizmo( this.renderTarget, resolution, this)

        this.handlerListener = this.handler.bind(this)
        window.gpu.canvas.addEventListener("mouseup", this.handlerListener)
        window.gpu.canvas.addEventListener("mousedown", this.handlerListener)


    }

    handler(event) {
        switch (event.type) {
        case "mousedown":
            if (event.button === LEFT_BUTTON) {
                if (this.targetGizmo) {
                    this.targetGizmo.onMouseDown(event)
                    window.gpu.canvas.addEventListener("mousemove", move)
                }
                window.gpu.canvas.targetGizmo = this.targetGizmo
            }
            break
        case "mouseup":
            if (this.targetGizmo)
                this.targetGizmo.onMouseUp(event)
            this.targetGizmo = undefined
            this.gizmoTooltip.stop()
            window.gpu.canvas.removeEventListener("mousemove", move)
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
        camOrtho
    ) {
        this.frameBuffer.startMapping()
        window.renderer.picking.shaderSameSize.use()
        mesh.use()
        window.gpu.disable(window.gpu.CULL_FACE)
        for (let i = 0; i < transforms.length; i++) {
            window.renderer.picking.shaderSameSize.bindForUse({
                viewMatrix: view,
                transformMatrix: transforms[i],
                projectionMatrix: projection,
                uID: [...generateNextID(i + 1), 1.],
                camPos,
                translation,
                cameraIsOrthographic: camOrtho
            })

            window.gpu.drawElements(window.gpu.TRIANGLES, mesh.verticesQuantity, window.gpu.UNSIGNED_INT, 0)
        }
        window.gpu.enable(window.gpu.CULL_FACE)
        mesh.finish()
        this.frameBuffer.stopMapping()

        return this.frameBuffer
    }

    execute(
        meshes,
        meshesMap,
        selected,
        camera,

        entities,
        gizmo,
        transformationType = ROTATION_TYPES.GLOBAL,
        onGizmoStart,
        onGizmoEnd,
        gridSize,
        gridRotationSize,
        gridScaleSize,
        setSelected
    ) {
        super.execute()

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
                this.translationGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,   entities, transformationType, onGizmoStart, onGizmoEnd, gridSize, setSelected)
                break
            case GIZMOS.ROTATION:
                this.targetGizmo = this.rotationGizmo
                this.rotationGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,  entities, transformationType, onGizmoStart, onGizmoEnd, gridRotationSize ? gridRotationSize : .1, setSelected)
                break
            case GIZMOS.SCALE:
                this.targetGizmo = this.scaleGizmo
                this.scaleGizmo.execute(meshes, meshesMap, this.selectedEntities, camera,   entities, transformationType, onGizmoStart, onGizmoEnd, gridScaleSize ? gridScaleSize : .0001, setSelected)
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
