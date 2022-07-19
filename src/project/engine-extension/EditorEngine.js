import Renderer from "../engine/Renderer"
import {STEPS_CUBE_MAP} from "../engine/systems/passes/SpecularProbePass"
import Wrapper from "./systems/Wrapper"
import MaterialInstance from "../engine/instances/MaterialInstance"
import * as debugCode from "./shaders/DEBUG.glsl"
import * as shaderCode from "../engine/shaders/mesh/FALLBACK.glsl"
import {DATA_TYPES} from "../engine/data/DATA_TYPES"
import SHADING_MODELS from "../static/misc/SHADING_MODELS"
import {STEPS_LIGHT_PROBE} from "../engine/systems/passes/DiffuseProbePass"
import Packager from "../engine/Packager"
import ENVIRONMENT from "../engine/data/ENVIRONMENT"
import MeshInstance from "../engine/instances/MeshInstance"
import EditorCamera from "./camera/EditorCamera"
import CameraEvents from "./camera/CameraEvents"

export default class EditorEngine extends Renderer {
    gizmo
    cursor
    selected = []


    constructor(resolution) {
        super(resolution)
        this.camera = new EditorCamera()
        this.cameraEvents = new CameraEvents(this.camera)

        this.environment = ENVIRONMENT.DEV
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
        Promise.all(
            [
                import("./data/SPHERE.json"),
                import("./data/Camera.json")]
        ).then(([sphere, camera]) => {
            this.sphereMesh = new MeshInstance({
                ...sphere,
                uvs: [],
                tangents: [],
            })
            this.cameraMesh = new MeshInstance({
                ...camera,
                uvs: [],
                tangents: [],
            })
            this.cubeMesh = new MeshInstance({
                vertices: [-1, -1, 1, -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, 1, -1],
                indices: [0, 3, 9, 0, 9, 6, 8, 10, 21, 8, 21, 19, 20, 23, 17, 20, 17, 14, 13, 15, 4, 13, 4, 2, 7, 18, 12, 7, 12, 1, 22, 11, 5, 22, 5, 16]
            })
        })
    }

    generatePreview(material) {
        return this.editorSystem.previewSystem.execute(this.params, this.data, material)
    }

    generateMeshPreview(entity, mesh) {
        return this.editorSystem.previewSystem.execute(this.params, this.data, mesh, entity)
    }

    get gizmos() {
        return {
            rotation: this.editorSystem.gizmoSystem.rotationGizmo,
            translation: this.editorSystem.gizmoSystem.translationGizmo,
            scale: this.editorSystem.gizmoSystem.scaleGizmo
        }
    }

    refreshProbes() {
        this.renderingPass.diffuseProbe.step = STEPS_CUBE_MAP.BASE
        this.renderingPass.specularProbe.step = STEPS_LIGHT_PROBE.GENERATION
    }

    updatePackage(prodEnv, params,   levelScript, fallbackMaterial) {
        this.environment = prodEnv ? ENVIRONMENT.PROD : ENVIRONMENT.DEV
        if (!prodEnv)
            this.cameraEvents.startTracking()
        else
            this.cameraEvents.stopTracking()

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

        Packager({
            params: {
                ...params,
                camera: prodEnv ? this.rootCamera : this.camera,
                gizmo: this.gizmo,
                cursor: this.cursor
            },
            onWrap: this.editorSystem,
            fallbackMaterial,
            levelScript,
        })
    }

    arrayToObject(arr) {
        const obj = {}
        arr.forEach(a => {
            obj[a] = true
        })
        return obj
    }

    stop() {
        super.stop()
        this.cameraEvents.stopTracking()
    }

}

