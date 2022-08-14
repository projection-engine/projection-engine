import Renderer from "../engine/Renderer"
import {STEPS_CUBE_MAP} from "../engine/libs/passes/rendering/SpecularProbePass"
import Wrapper from "./services/Wrapper"
import MaterialInstance from "../engine/libs/instances/MaterialInstance"
import * as debugCode from "./templates/shaders/DEBUG.glsl"
import * as shaderCode from "../engine/data/shaders/FALLBACK.glsl"
import DATA_TYPES from "../engine/data/DATA_TYPES"
import SHADING_MODELS from "../../data/misc/SHADING_MODELS"
import {STEPS_LIGHT_PROBE} from "../engine/libs/passes/rendering/DiffuseProbePass"
import Packager from "../engine/libs/builder/Packager"
import ENVIRONMENT from "../engine/data/ENVIRONMENT"
import MeshInstance from "../engine/libs/instances/MeshInstance"
import EditorCamera from "./libs/camera/EditorCamera"
import CameraEvents from "./libs/camera/CameraEvents"
import sphere from "./data/SPHERE.json"
import camera from "./data/CAMERA.json"
import EngineLoop from "../engine/libs/loop/EngineLoop";

export default class EditorRenderer extends Renderer {
    gizmo
    cursor
    selected = []
    static sphereMesh

    constructor(resolution) {
        super(resolution)
        this.camera = new EditorCamera()
        this.cameraEvents = new CameraEvents(this.camera)

        Renderer.environment = ENVIRONMENT.DEV
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

        EditorRenderer.sphereMesh = new MeshInstance({
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
        EngineLoop.renderMap.get("diffuseProbe").step = STEPS_CUBE_MAP.BASE
        EngineLoop.renderMap.get("specularProbe").step = STEPS_LIGHT_PROBE.GENERATION
    }

    updatePackage(prodEnv, params) {
        Renderer.environment = prodEnv ? ENVIRONMENT.EXECUTION : ENVIRONMENT.DEV
        if (!prodEnv)
            this.cameraEvents.startTracking()
        else
            this.cameraEvents.stopTracking()

        this.debugMaterial.uniformData.shadingModel = params.shadingModel
        Packager.build(
            {
                ...params,
                camera: prodEnv ? this.rootCamera : this.camera,
                gizmo: this.gizmo,
                cursor: this.cursor,
                onWrap: prodEnv ? null : this.editorSystem,
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

