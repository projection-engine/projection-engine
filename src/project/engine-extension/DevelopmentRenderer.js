import Renderer from "../engine/Renderer"

import {STEPS_CUBE_MAP} from "../engine/systems/passes/SpecularProbePass"
import Cameras from "./Cameras"
import Wrapper from "./systems/Wrapper"

import MaterialInstance from "../engine/instances/MaterialInstance"

import * as debugCode from "./shaders/DEBUG.glsl"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import {DATA_TYPES} from "../engine/templates/DATA_TYPES"
import SHADING_MODELS from "../engine/templates/SHADING_MODELS"
import {STEPS_LIGHT_PROBE} from "../engine/systems/passes/DiffuseProbePass"
import Packager from "../engine/Packager"
import ENVIRONMENT from "../engine/ENVIRONMENT"


export default class DevelopmentRenderer extends Renderer {
    gizmo
    cameraData = {}

    constructor( resolution) {
        super( resolution)
        this.environment = ENVIRONMENT.DEV
        this.cameraData = new Cameras()
        this.editorSystem = new Wrapper(resolution)
        this.debugMaterial = new MaterialInstance({
            vertex: shaderCode.vertex,
            fragment: debugCode.fragment,
            uniformData: [{
                key: "shadingModel",
                data: SHADING_MODELS.DEPTH,
                type: DATA_TYPES.INT
            }],
            settings: {
                isForwardShaded: true,
                doubledSided: true
            },
            id: "shading-models"
        })

        
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
        this.renderingPass.diffuseProbe.step = STEPS_CUBE_MAP.BASE
        this.renderingPass.specularProbe.step = STEPS_LIGHT_PROBE.GENERATION
    }

    updatePackage(prodEnv, cursor, entities, materials, meshes, params, onGizmoStart, onGizmoEnd, levelScript) {
        this.cameraData.cameraSpeed = params.cameraSpeed
        this.cameraData.cameraScrollSpeed = params.cameraScrollSpeed
        this.cameraData.cameraScrollDelay = params.cameraScrollDelay
        this.environment = prodEnv ?  ENVIRONMENT.PROD : ENVIRONMENT.DEV
        if (!prodEnv)
            this.cameraData.cameraEvents.startTracking()
        else
            this.cameraData.cameraEvents.stopTracking()

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

        this.debugMaterial.uniformData.shadingModel = params.shadingModel

        const p = {
            ...params,
            onGizmoStart,
            onGizmoEnd,
            camera: prodEnv ? this.rootCamera : this.camera,
            gizmo: this.gizmo,
            cursor,
            selectedMap: this.arrayToObject(params.selected)
        }
        Packager(
            {
                entities,
                materials: params.shadingModel !== SHADING_MODELS.DETAIL ? [] : materials,
                meshes,
                params: p,
                onWrap: this.editorSystem,
                fallbackMaterial: params.shadingModel !== SHADING_MODELS.DETAIL ?  this.debugMaterial : this.fallbackMaterial,
                levelScript
            },
            this
        )
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

