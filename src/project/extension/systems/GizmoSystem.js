import System from "../../engine/basic/System";
import TranslationGizmo from "../gizmo/TranslationGizmo";
import RotationGizmo from "../gizmo/RotationGizmo";
import GIZMOS from "../gizmo/GIZMOS";
import ScaleGizmo from "../gizmo/ScaleGizmo";
import ROTATION_TYPES from "../gizmo/ROTATION_TYPES";
import ShaderInstance from "../../engine/instances/ShaderInstance";
import * as gizmoShaderCode from "../shaders/gizmo.glsl";
import GizmoToolTip from "../gizmo/GizmoToolTip";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import generateNextID from "../../engine/utils/generateNextID";

function move(event) {
    const canvas = event.target
    if (canvas.targetGizmo)
        canvas.targetGizmo.onMouseMove(event)
}

export default class GizmoSystem extends System {
    hiddenTarget = true
    targetGizmo

    constructor(gpu) {
        super([]);
        this.gpu = gpu
        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertex, gizmoShaderCode.fragment, gpu)

        const canvas = gpu.canvas
        if (gpu.canvas.id) {
            const targetID = canvas.id + '-gizmo'
            if (document.getElementById(targetID) !== null)
                this.renderTarget = document.getElementById(targetID)
            else {
                this.renderTarget = document.createElement('div')
                this.renderTarget.id = targetID
                Object.assign(this.renderTarget.style, {
                    backdropFilter: "blur(10px) brightness(70%)", borderRadius: "5px", width: "fit-content",
                    height: 'fit-content', position: 'absolute', top: '4px', left: '4px', zIndex: '10',
                    color: 'white', padding: '8px', fontSize: '.75rem',
                    display: 'none'
                });
                document.body.appendChild(this.renderTarget)
            }
            this.gizmoTooltip = new GizmoToolTip(this.renderTarget)
            this.translationGizmo = new TranslationGizmo(gpu, this.gizmoShader, this.gizmoTooltip)
            this.scaleGizmo = new ScaleGizmo(gpu, this.gizmoShader, this.gizmoTooltip)
            this.rotationGizmo = new RotationGizmo(gpu, this.renderTarget)
        }

        this.handlerListener = this.handler.bind(this)
        this.gpu.canvas.addEventListener('mouseup', this.handlerListener)
        this.gpu.canvas.addEventListener('mousedown', this.handlerListener)
    }

    handler(event) {
        switch (event.type) {
            case 'mousedown':
                if (this.targetGizmo) {
                    this.targetGizmo.onMouseDown(event)
                    this.gpu.canvas.addEventListener('mousemove', move)
                }
                this.gpu.canvas.targetGizmo = this.targetGizmo
                break
            case 'mouseup':
                if (this.targetGizmo) {
                    this.targetGizmo.onMouseUp(event)
                }
                this.targetGizmo = undefined
                this.gizmoTooltip.stop()
                this.gpu.canvas.removeEventListener('mousemove', move)
                break
            default:
                break
        }
    }

    static drawToDepthSampler(depthSystem, mesh, view, projection, transforms, shader, camPos,
                              translation) {
        // DOESNT AFFECT AO BECAUSE IT IS AFTER
        depthSystem.frameBuffer.startMapping()
        shader.use()
        mesh.use()
        depthSystem.gpu.disable(depthSystem.gpu.CULL_FACE)
        for(let i=0; i<transforms.length; i++){
            shader.bindForUse({
                viewMatrix: view,
                transformMatrix: transforms[i],
                projectionMatrix: projection,
                uID: [...generateNextID(i + 1), 1.],
                camPos,
                translation,
            })
            depthSystem.gpu.drawElements(depthSystem.gpu.TRIANGLES, mesh.verticesQuantity, depthSystem.gpu.UNSIGNED_INT, 0)
        }
        depthSystem.gpu.enable(depthSystem.gpu.CULL_FACE)
        mesh.finish()


        depthSystem.frameBuffer.stopMapping()
    }

    execute(
        meshes,
        meshSources,
        selected,
        camera,
        pickSystem,
        lockCamera,
        entities,
        gizmo,
        transformationType = ROTATION_TYPES.GLOBAL,
        onGizmoStart,
        onGizmoEnd,
        gridSize,
        gridRotationSize,
        gridScaleSize,
        depthSystem
    ) {
        super.execute()

        this.gpu.clear(this.gpu.DEPTH_BUFFER_BIT)
        if (selected.length > 0)
            switch (gizmo) {
                case GIZMOS.TRANSLATION:
                    this.targetGizmo = this.translationGizmo
                    this.translationGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridSize, depthSystem)
                    break
                case GIZMOS.ROTATION:
                    this.targetGizmo = this.rotationGizmo
                    this.rotationGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridRotationSize ? gridRotationSize : .1, depthSystem)
                    break
                case GIZMOS.SCALE:
                    this.targetGizmo = this.scaleGizmo
                    this.scaleGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridScaleSize ? gridScaleSize : .0001, depthSystem)
                    break
            }
        else
            this.targetGizmo = null

    }
}
