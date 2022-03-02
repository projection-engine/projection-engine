import MeshInstance from "../engine/elements/instances/MeshInstance";
import Entity from "../engine/ecs/basic/Entity";
import TransformComponent from "../engine/ecs/components/TransformComponent";

import MeshComponent from "../engine/ecs/components/MeshComponent";
import PickComponent from "../engine/ecs/components/PickComponent";
import MaterialComponent from "../engine/ecs/components/MaterialComponent";

export default async function importMesh(objLoaded, engine, id, index, fileSystem) {

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
                maxBoundingBox: objLoaded.maxBoundingBox,
                minBoundingBox: objLoaded.minBoundingBox,
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
        const transformation = new TransformComponent()
        transformation.scaling = objLoaded.scaling
        transformation.rotation = objLoaded.rotation
        transformation.translation = objLoaded.translation

        entity.components.MaterialComponent = new MaterialComponent(undefined, mesh.material)
        entity.components.MeshComponent = new MeshComponent(undefined, mesh.id)
        entity.components.TransformComponent = transformation
        entity.components.PickComponent = new PickComponent(undefined, engine.entities.length + index + 1)

    } catch (e) {
    }

    return {
        mesh,
        material,
        entity,
        existsMesh
    }
}