import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import LoopAPI from "../../../libs/engine/production/libs/apis/LoopAPI";
import RendererController from "../../../libs/engine/production/RendererController";
import CameraAPI from "../../../libs/engine/production/libs/apis/CameraAPI";
import EditorRenderer from "../../../libs/engine/editor/EditorRenderer";
import IconsSystem from "../../../libs/engine/editor/services/IconsSystem";
import GPU from "../../../libs/engine/production/GPU";
import STATIC_MESHES from "../../../libs/engine/static/STATIC_MESHES";

export default function drawIconsToBuffer() {
    const depthSystem = LoopAPI.renderMap.get("depthPrePass")
    const entities = Array.from(RendererController.entitiesMap.values())

    const shader = depthSystem.shader
    const FBO = depthSystem.frameBuffer
    FBO.startMapping(undefined, undefined, false)
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i]
        if (entity.active) {
            const transformationMatrix = entity.transformationMatrix
            const comp = entity.components
            if (comp[COMPONENTS.POINT_LIGHT] || comp[COMPONENTS.PROBE] || comp[COMPONENTS.DIRECTIONAL_LIGHT])
                drawIcon(
                    GPU.meshes.get(entity.components[COMPONENTS.CAMERA] ? STATIC_MESHES.CAMERA : STATIC_MESHES.CUBE),
                    entity.pickID,
                    transformationMatrix,
                    shader
                )
        }
    }
    FBO.stopMapping(false)
}

function drawIcon(mesh, meshID, transformMatrix, shader) {
    mesh.useForDepth()
    shader.bindForUse({
        meshID,
        projectionMatrix: CameraAPI.projectionMatrix,
        transformMatrix,
        viewMatrix: CameraAPI.viewMatrix
    })

    mesh.draw()
}