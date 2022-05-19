import Entity from "../../engine/basic/Entity";
import COMPONENTS from "../../engine/templates/COMPONENTS";
import FolderComponent from "../../engine/components/FolderComponent";
import {initializeEntity} from "./importMesh";
import MeshInstance from "../../engine/instances/MeshInstance";
import {ENTITY_ACTIONS} from "../../engine/useEngineEssentials";

export default async function importScene(fileSystem, engine, reg, setAlert) {
    const file = await fileSystem.readFile(fileSystem.path + '\\assets\\' + reg.path, 'json')
    console.log(file)
    if (file) {
        const folder = new Entity()
        folder.name = file.name
        folder.components[COMPONENTS.FOLDER] = new FolderComponent()

        const meshes = []
        const entities = []

        for (let i in file.nodes) {
            const data = await loopNodes(file.nodes[i], fileSystem, engine.gpu, folder.id)

            meshes.push(...data.meshes)
            entities.push(...data.children)

        }
        entities.push(folder)

        engine.setMeshes(prev => {
            return [...prev, ...meshes]
        })
        engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
    } else
        setAlert({message: 'Error loading scene', type: 'error'})
    // const res = await fileSystem.readRegistryFile(data)

}

async function loopNodes(node, fileSystem, gpu, parent) {
    const meshes = [], children = []


    const entity = new Entity(node.id)
    entity.name = node.name
    entity.linkedTo = parent
    entity.components[COMPONENTS.FOLDER] = new FolderComponent()
    for (let m in node.primitives) {
        const primitive = node.primitives[m]
        const reg = await fileSystem.readRegistryFile(primitive)
        if (reg) {
            const meshData = await fileSystem.readFile(fileSystem.path + '\\assets\\' + reg.path, 'json')
            console.log(meshData, reg)
            const instance = new MeshInstance({
                ...meshData,
                id: reg.id,
                gpu: gpu,
            })
            meshes.push(instance)
            children.push(initializeEntity(meshData, instance.id, entity.id))
        }
    }
    children.push(entity)

    for (let i in node.children) {
        const data = await loopNodes(node.children[i], fileSystem, gpu, entity.id)
        meshes.push(...data.meshes)
        children.push(...data.children)
    }

    return {meshes, children}
}