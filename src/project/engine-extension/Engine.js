import Renderer from "../engine/Renderer"
import SYSTEMS from "../engine/templates/SYSTEMS"
import {STEPS_CUBE_MAP} from "../engine/systems/CubeMapSystem"
import Cameras from "./Cameras"
import Wrapper from "./Wrapper"

import MaterialInstance from "../engine/instances/MaterialInstance"

import * as debugCode from "./shaders/DEBUG.glsl"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import {DATA_TYPES} from "../engine/templates/DATA_TYPES"
import SHADING_MODELS from "../engine/templates/SHADING_MODELS"
import {STEPS_LIGHT_PROBE} from "../engine/systems/LightProbeSystem"


export default class Engine extends Renderer {
    gizmo
    cameraData = {}

    constructor( resolution, systems) {
        super( resolution, systems)
        this.cameraData = new Cameras()
        this.editorSystem = new Wrapper(resolution)
        this.debugMaterial = new MaterialInstance(
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
    generatePreview(material){
        return this.editorSystem.previewSystem.execute(this.params, this.data, material)
    }
    generateMeshPreview(entity, mesh){
        return this.editorSystem.previewSystem.execute(this.params, this.data, mesh, entity)
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


    updatePackage(cursor, entities, materials, meshes, params, onGizmoStart, onGizmoEnd, levelScript) {
        this.cameraData.cameraSpeed = params.cameraSpeed
        this.cameraData.cameraScrollSpeed = params.cameraScrollSpeed
        this.cameraData.cameraScrollDelay = params.cameraScrollDelay

        if (!params.canExecutePhysicsAnimation)
            this.cameraData.cameraEvents.startTracking()
        else
            this.cameraData.cameraEvents.stopTracking()

        this._changed = true

        this.camera.zNear = params.zNear
        this.camera.zFar = params.zFar
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
            this.debugMaterial,
            entities,
            params.shadingModel !== SHADING_MODELS.DETAIL ? [] : materials,
            meshes,
            {
                ...params,
                onGizmoStart,
                onGizmoEnd,
                camera,
                gizmo: this.gizmo,
                cursor,
                selectedMap: this.arrayToObject(params.selected)
            },
            this.editorSystem,
            levelScript
        )
        this.start()
    }
    arrayToObject(arr){
        const obj = {}
        arr.forEach(a => {
            obj[a] = true
        })
        return obj
    }
    stop() {
        super.stop()
        this.cameraData.cameraEvents.stopTracking()
    }
}

