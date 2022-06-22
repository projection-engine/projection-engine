import Entity from "../../engine/basic/Entity"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import FolderComponent from "../../engine/components/FolderComponent"
import {initializeEntity} from "./importMesh"
import MeshInstance from "../../engine/instances/MeshInstance"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import FileSystem from "../../utils/files/FileSystem"

export default async function importScene(  engine, reg, onlyReturn) {
    const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path, "json")
    const meshes = []
    const entities = []
    if (file) {
        const folder = new Entity()
        folder.name = file.name
        folder.components[COMPONENTS.FOLDER] = new FolderComponent()


        for (let i in file.nodes) {
            const data = await loopNodes(file.nodes[i], folder.id)

            meshes.push(...data.meshes)
            entities.push(...data.children)

        }
        entities.push(folder)
        if(!onlyReturn) {
            engine.setMeshes(prev => {
                return [...prev, ...meshes]
            })
            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
        }
    } else
        alert.pushAlert("Error loading scene",  "error")


    return {meshes, entities}
}

async function loopNodes(node,   parent) {
    const meshes = [], children = []


    const entity = new Entity(node.id)
    entity.name = node.name
    entity.linkedTo = parent
    entity.components[COMPONENTS.FOLDER] = new FolderComponent()
    for (let m in node.primitives) {
        const primitive = node.primitives[m]
        const reg = await window.fileSystem.readRegistryFile(primitive)
        if (reg) {
            const meshData = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path, "json")

            const instance = new MeshInstance({
                ...meshData,
                id: reg.id
            })
            meshes.push(instance)
            children.push(initializeEntity(meshData, instance.id, entity.id))
        }
    }
    children.push(entity)

    for (let i in node.children) {
        const data = await loopNodes(node.children[i], entity.id)
        meshes.push(...data.meshes)
        children.push(...data.children)
    }

    return {meshes, children}
}