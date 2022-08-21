import Translation from "../libs/gizmo/Translation"
import Rotation from "../libs/gizmo/Rotation"
import Scale from "../libs/gizmo/Scale"
import TRANSFORMATION_TYPE from "../../../data/misc/TRANSFORMATION_TYPE"
import ShaderInstance from "../../engine/libs/instances/ShaderInstance"
import * as gizmoShaderCode from "../templates/GIZMO.glsl"
import getPickerId from "../../engine/utils/get-picker-id"
import * as shaderCode from "../../engine/data/shaders/PICK.glsl"
import LoopAPI from "../../engine/libs/apis/LoopAPI";

let depthSystem
export default class GizmoSystem {
    targetGizmo
    selectedEntities = []

    constructor() {


        this.gizmoShader = new ShaderInstance(gizmoShaderCode.vertex, gizmoShaderCode.fragment)

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
                uID: [...getPickerId(i + 1), 1.],
                camPos,
                translation,
                cameraIsOrthographic
            })
            gpu.drawElements(gpu.TRIANGLES, mesh.verticesQuantity, gpu.UNSIGNED_INT, 0)
        }
        gpu.enable(gpu.CULL_FACE)
        mesh.finish()
        gpu.bindVertexArray(null)
        depthSystem.frameBuffer.stopMapping()
        return depthSystem.frameBuffer
    }

    execute(
        meshes,
        selected,
        transformationType = TRANSFORMATION_TYPE.GLOBAL
    ) {

        if (!depthSystem)
            depthSystem = LoopAPI.renderMap.get("depthPrePass")
        if (selected.length > 0 && this.selectedEntities.length > 0 && this.targetGizmo) {
            gpu.clear(gpu.DEPTH_BUFFER_BIT)
            this.targetGizmo.execute(meshes, this.selectedEntities, transformationType)
        }
        else if (this.targetGizmo) {
            this.targetGizmo = undefined
            this.selectedEntities = []
        }
    }
}
