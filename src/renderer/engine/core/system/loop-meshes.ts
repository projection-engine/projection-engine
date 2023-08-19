import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import MeshComponent from "@engine-core/lib/components/MeshComponent";
import CullingComponent from "@engine-core/lib/components/CullingComponent";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import Mesh from "@engine-core/lib/resources/Mesh";
import Material from "@engine-core/lib/resources/Material";

export default function loopMeshes(callback: (param1: EngineEntity, param2: Mesh, param3: Material, param4: TransformationComponent, param5: CullingComponent, param6: number) => void) {
    const toRender = EntityManager.withComponent(Components.MESH).array
    const size = toRender.length
    if (size === 0)
        return
    for (let meshIndex = 0; meshIndex < size; meshIndex++) {
        const entity = toRender[meshIndex]
        const components = EntityManager.getAllComponentsMap(entity)
        const meshComponent = components.get(Components.MESH) as MeshComponent
        const transformComponent = components.get(Components.TRANSFORMATION) as TransformationComponent
        const cullingComponent = components.get(Components.CULLING) as CullingComponent
        if (!transformComponent || !meshComponent.meshID || !EntityManager.isEntityEnabled(entity) || cullingComponent && cullingComponent.isDistanceCulled)
            continue
        callback(entity, meshComponent.getMeshInstance(), meshComponent.getMaterialInstance(), transformComponent, cullingComponent, meshIndex)
    }
}
