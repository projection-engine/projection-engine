import GPUState from "@engine-core/states/GPUState"

import StaticMeshesState from "@engine-core/states/StaticMeshesState"
import StaticFBOState from "@engine-core/states/StaticFBOState"
import StaticEditorShaders from "../utils/StaticEditorShaders"
import EngineTools from "../EngineTools"
import AbstractSystem from "../../core/AbstractSystem";
import EntityManager from "@engine-core/managers/EntityManager";
import {Components} from "@engine-core/engine.enum";
import SpriteComponent from "@engine-core/lib/components/SpriteComponent";
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";

export default class SelectedSystem extends AbstractSystem {

    static #METADATA = new Float32Array(9)

     shouldExecute = (): boolean =>  {
        const should = EngineTools.selected.length > 0;
        if (!should)
            StaticFBOState.postProcessing1.clear()
        return should;
    }

     execute = () => {
        const length = EngineTools.selected.length
        const context = GPUState.context
        const uniforms = StaticEditorShaders.silhouetteUniforms
        const metadata = SelectedSystem.#METADATA

        StaticFBOState.postProcessing1.startMapping()
        StaticEditorShaders.silhouette.bind()
        for (let m = 0; m < length; m++) {
            const current = EngineTools.selected[m]
            if (!current || !current.active)
                continue
            const transformationComponent = current.getComponent<TransformationComponent>(Components.TRANSFORMATION)
            if (!transformationComponent)
                continue
            const sprite = current.getComponent<SpriteComponent>(Components.SPRITE)
            const meshComponent = current.getComponent<MeshComponent>(Components.MESH)
            const mesh = meshComponent && meshComponent.meshID ? GPUState.meshes.get(meshComponent.meshID) : undefined
            const pId = EntityManager.getEntityPickVec3(current.id)
            metadata[6] = pId[0]
            metadata[7] = pId[1]
            metadata[8] = pId[2]
            metadata[0] = sprite && !mesh ? 1 : 0

            context.uniformMatrix4fv(uniforms.transformMatrix, false, transformationComponent.matrix)
            if (mesh) {
                context.uniformMatrix3fv(uniforms.metadata, false, metadata)
                mesh.draw()
            } else if (sprite) {
                metadata[1] = sprite.attributes[0]
                metadata[2] = sprite.attributes[1]
                metadata[3] = transformationComponent.scaling[0]
                metadata[4] = transformationComponent.scaling[1]
                metadata[5] = transformationComponent.scaling[2]
                context.uniformMatrix3fv(uniforms.metadata, false, metadata)
                StaticMeshesState.drawQuad()
            }
        }
        StaticFBOState.postProcessing1.stopMapping()
    }
}
