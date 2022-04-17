import MeshInstance from "../../../../engine/shared/instances/MeshInstance";
import Entity from "../../../../engine/shared/ecs/basic/Entity";
import TransformComponent from "../../../../engine/shared/ecs/components/TransformComponent";

import MeshComponent from "../../../../engine/shared/ecs/components/MeshComponent";
import PickComponent from "../../../../engine/shared/ecs/components/PickComponent";
import MaterialComponent from "../../../../engine/shared/ecs/components/MaterialComponent";
import COMPONENTS from "../../../../engine/shared/templates/COMPONENTS";

export default async function importMesh(objLoaded, engine, id, index, fileSystem, isBlueprint) {

    let mesh,
        entity,
        existsMesh = false,
        material
    try {
        mesh = engine.meshes.find(m => m.id === objLoaded.id)
        if (!mesh) {
            mesh = new MeshInstance({
                ...objLoaded,
                id: id,
                gpu: engine.gpu,
                wireframeBuffer: true
            })

            if (objLoaded.material && !engine.materials.find(m => m.id === objLoaded.material)) {
                const rs = await fileSystem.readRegistryFile(objLoaded.material)
                if (rs) {
                    const file = await fileSystem.readFile(fileSystem.path + '\\assets\\' + rs.path, 'json')

                    if (file && file.response)
                        material = {
                            ...file.response,
                            id: objLoaded.material
                        }
                }
            }
        }
        else
            existsMesh = true

        entity = new Entity(undefined, objLoaded.name)
        entity.isBlueprint = isBlueprint
        const transformation = new TransformComponent()
        transformation.scaling = objLoaded.scaling
        transformation.rotation = objLoaded.rotation
        transformation.translation = objLoaded.translation

        entity.components[COMPONENTS.MATERIAL] = new MaterialComponent(undefined, mesh.material)
        entity.components[COMPONENTS.MESH] = new MeshComponent(undefined, mesh.id)
        entity.components[COMPONENTS.TRANSFORM] = transformation
        entity.components[COMPONENTS.PICK] = new PickComponent(undefined, engine.entities.length + index + 1)

    } catch (e) {

    }

    return {
        mesh,
        material,
        entity,
        existsMesh
    }
}