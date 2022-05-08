import System from "../../engine/basic/System";
import TranslationGizmo from "../gizmo/TranslationGizmo";
import RotationGizmo from "../gizmo/RotationGizmo";
import GIZMOS from "../gizmo/GIZMOS";
import ScaleGizmo from "../gizmo/ScaleGizmo";
import ROTATION_TYPES from "../gizmo/ROTATION_TYPES";
import MeshInstance from "../../engine/instances/MeshInstance";
import cube from "../assets/Cube.json";
import ShaderInstance from "../../engine/instances/ShaderInstance";
import * as gizmoShaderCode from "../../engine/shaders/misc/gizmo.glsl";

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
                canvas.parentNode.appendChild(this.renderTarget)
            }

            this.translationGizmo = new TranslationGizmo(gpu, this.gizmoShader, this.renderTarget)
            this.scaleGizmo = new ScaleGizmo(gpu, this.gizmoShader, this.renderTarget)

            this.rotationGizmo = new RotationGizmo(gpu, this.renderTarget)


            this.boundingBox = new MeshInstance({
                gpu,
                vertices: cube.vertices,
                indices: cube.indices
            })
        }
        this.handlerListener = this.handler.bind(this)

        this.gpu.canvas.addEventListener('mouseup', this.handlerListener)
        this.gpu.canvas.addEventListener('mousedown', this.handlerListener)
        this.gpu.canvas.addEventListener('mousemove', this.handlerListener)
    }

    handler(event) {
        switch (event.type) {
            case 'mousedown':
                if (this.targetGizmo)
                    this.targetGizmo.onMouseDown(event)
                break
            case 'mouseup':
                if (this.targetGizmo) {
                    this.targetGizmo.onMouseUp(event)
                    this.targetGizmo = undefined
                }
                break
            case 'mousemove':
                if (this.targetGizmo)
                    this.targetGizmo.onMouseMove(event)
                break
            default:
                break
        }
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
        gridScaleSize
    ) {
        super.execute()

        this.gpu.clear(this.gpu.DEPTH_BUFFER_BIT)

        switch (gizmo) {
            case GIZMOS.TRANSLATION:
                this.targetGizmo = this.translationGizmo
                this.translationGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridSize ? gridSize : .0001)
                break
            case GIZMOS.ROTATION:
                this.targetGizmo = this.rotationGizmo
                this.rotationGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridRotationSize ? gridRotationSize : .1)
                break
            case GIZMOS.SCALE:
                this.targetGizmo = this.scaleGizmo
                this.scaleGizmo.execute(meshes, meshSources, selected, camera, pickSystem, lockCamera, entities, transformationType, onGizmoStart, onGizmoEnd, gridScaleSize ? gridScaleSize : .0001)
                break
        }

    }
}
