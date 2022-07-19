import Translation from "../gizmo/Translation"
import Rotation from "../gizmo/Rotation"
import Scale from "../gizmo/Scale"
import TRANSFORMATION_TYPE from "../../static/misc/TRANSFORMATION_TYPE"
import ShaderInstance from "../../engine/instances/ShaderInstance"
import * as gizmoShaderCode from "../shaders/GIZMO.glsl"
import Tooltip from "../gizmo/Tooltip"
import generateNextID from "../../engine/utils/generateNextID"
import * as shaderCode from "../../engine/shaders/PICK.glsl"

let gpu, depthSystem
export default class GizmoSystem {
    targetGizmo
    selectedEntities = []

    constructor() {
        gpu = window.gpu
        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertex, gizmoShaderCode.fragment)
        this.tooltip = new Tooltip()
        this.translationGizmo = new Translation(this)
        this.scaleGizmo = new Scale(this)
        this.rotationGizmo = new Rotation(this)
        this.shaderSameSize = new ShaderInstance(shaderCode.sameSizeVertex, shaderCode.fragment)
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
        transformationType = TRANSFORMATION_TYPE.GLOBAL
    ) {
        if (!depthSystem)
            depthSystem = window.renderer.renderingPass.depthPrePass
        if (selected.length > 0 && this.selectedEntities.length > 0 && this.targetGizmo)
            this.targetGizmo.execute(meshes, meshesMap, this.selectedEntities, transformationType)
        else if (this.targetGizmo) {
            this.targetGizmo = undefined
            this.selectedEntities = []
        }
    }
}
