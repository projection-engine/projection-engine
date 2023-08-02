import GPU from "../../core/GPU"

import StaticMeshes from "../../core/lib/StaticMeshes"
import StaticFBO from "../../core/lib/StaticFBO"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import EngineTools from "../EngineTools"
import EngineToolsState from "../EngineToolsState"
import GPUUtil from "../../core/utils/GPUUtil";
import AbstractSystem from "../../core/AbstractSystem";

export default class SelectedSystem extends AbstractSystem {

    static #METADATA = new Float32Array(9)

    shouldExecute(): boolean {
        const should = EngineTools.selected.length > 0;
        if (!should)
            StaticFBO.postProcessing1.clear()
        return should;
    }

    execute() {
        const length = EngineTools.selected.length
        const context = GPU.context
        const uniforms = StaticEditorShaders.silhouetteUniforms
        const metadata = SelectedSystem.#METADATA

        StaticFBO.postProcessing1.startMapping()
        StaticEditorShaders.silhouette.bind()
        for (let m = 0; m < length; m++) {
            const current = EngineTools.selected[m]
            if (!current || !current.active)
                continue

            const sprite = current.spriteComponent
            const mesh = current.meshRef
            metadata[6] = current.pickID[0]
            metadata[7] = current.pickID[1]
            metadata[8] = current.pickID[2]
            metadata[0] = sprite && !mesh ? 1 : 0

            context.uniformMatrix4fv(uniforms.transformMatrix, false, current.matrix)
            if (mesh) {
                context.uniformMatrix3fv(uniforms.metadata, false, metadata)
                mesh.draw()
            } else if (sprite) {
                metadata[1] = sprite.attributes[0]
                metadata[2] = sprite.attributes[1]
                metadata[3] = current.scaling[0]
                metadata[4] = current.scaling[1]
                metadata[5] = current.scaling[2]
                context.uniformMatrix3fv(uniforms.metadata, false, metadata)
                StaticMeshes.drawQuad()
            }
        }
        StaticFBO.postProcessing1.stopMapping()
    }
}
