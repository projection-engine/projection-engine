import MeshInstance from "../../engine/instances/MeshInstance"
import Entity from "../../engine/basic/Entity"
import TransformComponent from "../../engine/components/TransformComponent"

import MeshComponent from "../../engine/components/MeshComponent"
import MaterialComponent from "../../engine/components/MaterialComponent"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import FileSystem from "../files/FileSystem"

export default async function importMesh(objLoaded, engine, id) {

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
                wireframeBuffer: true
            })

            if (objLoaded.material && !engine.materials.find(m => m.id === objLoaded.material)) {
                const rs = await window.fileSystem.readRegistryFile(objLoaded.material)
                if (rs) {
                    const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" +FileSystem.sep +  rs.path, "json")
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
        entity = initializeEntity(objLoaded, mesh.id)
    } catch (e) {
        alert.pushAlert("Error loading mesh", "error")
    }

    return {
        mesh,
        material,
        entity,
        existsMesh
    }
}

export function initializeEntity(data, meshID, parent){
    const entity = new Entity(undefined, data.name)
    entity.linkedTo = parent
    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotationQuat = data.rotationQuat
    transformation.translation = data.translation
    transformation.baseTransformationMatrix = data.baseTransformationMatrix
    entity.components[COMPONENTS.MATERIAL] = new MaterialComponent()
    entity.components[COMPONENTS.MESH] = new MeshComponent()
    entity.components[COMPONENTS.MESH].meshID = meshID
    entity.components[COMPONENTS.TRANSFORM] = transformation

    return entity
}