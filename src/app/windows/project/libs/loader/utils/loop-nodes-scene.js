import Entity from "../../engine/production/templates/basic/Entity";
import FilesAPI from "../../../../../libs/files/FilesAPI";
import MeshInstance from "../../engine/production/libs/instances/MeshInstance";
import initializeEntity from "./initialize-entity";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";

export default async function loopNodesScene(node, parent, index=0) {
    const meshes = [], children = []
    const entity = new Entity(node.id)
    entity.name = node.name ? node.name : "entity-" + index
    entity.parent = parent
    parent.children.push(entity)

    for (let m = 0;  m < node.primitives.length; m++) {
        const primitive = node.primitives[m]
        const reg = await RegistryAPI.readRegistryFile(primitive)
        if (reg) {
            const meshData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + reg.path, "json")

            const instance = new MeshInstance({
                ...meshData,
                id: reg.id
            })
            meshes.push(instance)
            children.push(initializeEntity(meshData, instance.id, entity, m + index))
        }
    }
    children.push(entity)

    for (let i = 0; i < node.children.length; i++) {
        const data = await loopNodesScene(node.children[i], entity, i)
        meshes.push(...data.meshes)
        children.push(...data.children)
    }

    return {meshes, children}
}