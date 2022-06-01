import Renderer from "../engine/Renderer"
import PickSystem from "../engine/systems/PickSystem"
import SYSTEMS from "../engine/templates/SYSTEMS"
import {STEPS_CUBE_MAP} from "../engine/systems/CubeMapSystem"
import COMPONENTS from "../engine/templates/COMPONENTS"
import Cameras from "./Cameras"
import Wrapper from "./Wrapper"
import * as debugCode from "./shaders/debug.glsl"
import MaterialInstance from "../engine/instances/MaterialInstance"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import {DATA_TYPES} from "../engine/templates/DATA_TYPES"
import SHADING_MODELS from "../engine/templates/SHADING_MODELS"
import {STEPS_LIGHT_PROBE} from "../engine/systems/LightProbeSystem"


export default class Engine extends Renderer {
    gizmo
    cameraData = {}
    #overrideMaterial
    changedEntity = undefined

    constructor(gpu, resolution, systems, settings, projectID) {
        super(gpu, resolution, systems, projectID)
        this.cameraData = new Cameras(
            gpu.canvas,
            settings.cameraPosition,
            settings.fov,
            settings.zNear,
            settings.zFar,
            settings.yaw,
            settings.pitch
        )
        this.initialized = true
        this.editorSystem = new Wrapper(gpu, resolution)
        this.debugMaterial = new MaterialInstance(
            gpu,
            shaderCode.vertex,
            debugCode.fragment,
            [{
                key: "shadingModel",
                data: SHADING_MODELS.DEPTH,
                type: DATA_TYPES.INT
            }], {
                isForwardShaded: true,
                doubledSided: true
            },
            undefined,
            "shading-models"
        )
    }


    get camera() {
        return this.cameraData.camera
    }

    set camera(data) {
        this.cameraData.camera = data
    }

    refreshCubemaps() {
        this.systems[SYSTEMS.CUBE_MAP].step = STEPS_CUBE_MAP.BASE
        this.systems[SYSTEMS.PROBE].step = STEPS_LIGHT_PROBE.GENERATION
    }

    testClick(currentCoords, ctrlKey, always) {
        const camera = this.camera
        const params = this.params
        const entities = this.filteredEntities
        const p = this.systems[SYSTEMS.PICK]
        const cameraMesh = this.editorSystem.billboardSystem.cameraMesh
        const meshSources = this.data.meshSources

        const pickID = p.pickElement((shader, proj) => {
            for (let m = 0; m < entities.length; m++) {
                const currentInstance = entities[m]
                if (entities[m].active) {
                    const t = currentInstance.components[COMPONENTS.TRANSFORM]
                    if (currentInstance.components[COMPONENTS.MESH]) {
                        const mesh = meshSources[currentInstance.components[COMPONENTS.MESH]?.meshID]
                        if (mesh !== undefined) PickSystem.drawMesh(mesh, currentInstance, camera.viewMatrix, proj, t.transformationMatrix, shader, this.gpu)
                    } else if (t) PickSystem.drawMesh(currentInstance.components[COMPONENTS.CAMERA] ? cameraMesh : p.mesh, currentInstance, camera.viewMatrix, proj, t.transformationMatrix, shader, this.gpu)
                }
            }
        }, currentCoords, camera)
        if (pickID > 0) {
            const entity = entities.find(e => e.components[COMPONENTS.PICK]?.pickID[0] * 255 === pickID)
            if (entity) params.setSelected(prev => {
                const i = prev.findIndex(e => e === entity.id)
                if (i > -1) {
                    prev.splice(i, 1)
                    return prev
                }
                if (ctrlKey) return [...prev, entity.id]
                else return [entity.id]
            })
        } else if (!always)
            params.setSelected([])
    }

    updateOverrideMaterial() {
        const entity = this.data.meshes.find(m => m.id === this.params.selected[0] || m.id === this.changedEntity?.id)
        const comp = entity ? entity.components[COMPONENTS.MATERIAL] : undefined
        if (comp && this.params.selected[0] && this.overrideMaterial instanceof MaterialInstance && !this.changedEntity) {
            this.changedEntity = {id: entity.id, previousMaterial: comp.materialID}
            comp.materialID = this.overrideMaterial?.id
        } else if (comp && this.changedEntity) {
            comp.materialID = this.changedEntity.previousMaterial
            this.changedEntity = undefined
        }
    }

    set overrideMaterial(data) {
        this.#overrideMaterial = data
        this.updateOverrideMaterial()
    }

    get overrideMaterial() {
        return this.#overrideMaterial
    }

    updatePackage(entities, materials, meshes, params, scripts = [], onGizmoStart, onGizmoEnd) {

        this.cameraData.cameraSpeed = params.cameraSpeed
        this.cameraData.cameraScrollSpeed = params.cameraScrollSpeed
        this.cameraData.cameraScrollDelay = params.cameraScrollDelay

        if (!params.canExecutePhysicsAnimation)
            this.cameraData.cameraEvents.startTracking()
        else
            this.cameraData.cameraEvents.stopTracking()

        this._changed = true
        this.camera.fov = params.fov
        this.camera.distortion = params.distortion
        this.camera.distortionStrength = params.distortionStrength
        this.camera.chromaticAberration = params.chromaticAberration
        this.camera.chromaticAberrationStrength = params.chromaticAberrationStrength
        this.camera.filmGrain = params.filmGrain
        this.camera.filmGrainStrength = params.filmGrainStrength
        this.camera.bloom = params.bloom
        this.camera.bloomStrength = params.bloomStrength
        this.camera.bloomThreshold = params.bloomThreshold
        this.camera.gamma = params.gamma
        this.camera.exposure = params.exposure


        const camera = params.canExecutePhysicsAnimation ? this.rootCamera : this.camera

        this.debugMaterial.uniformData.shadingModel = params.shadingModel
        super.updatePackage(
            params.shadingModel !== SHADING_MODELS.DETAIL && params.shadingModel !== SHADING_MODELS.ALBEDO && params.shadingModel !== SHADING_MODELS.LIGHT_ONLY ? this.debugMaterial : this.fallbackMaterial,
            entities,
            params.shadingModel !== SHADING_MODELS.DETAIL ? [] : [...materials, this.overrideMaterial],
            meshes,
            {
                ...params,
                onGizmoStart,
                onGizmoEnd,
                camera,
                lockCamera: (lock) => {
                    if (lock) {
                        this.cameraData.cameraEvents.stopTracking()
                    } else this.cameraData.cameraEvents.startTracking()
                },
                dataChanged: this._changed,
                setDataChanged: () => this._changed = false,
                gizmo: this.gizmo,
                isOrtho: camera.ortho
            },
            scripts,
            this.editorSystem,
        )
        if (typeof params.setSelected === "function") this.cameraData.onClick = (ck, c) => this.testClick(ck, c)
        this.start()
        this.updateOverrideMaterial()

    }

    stop() {
        super.stop()
        this.cameraData.cameraEvents.stopTracking()
    }
}

