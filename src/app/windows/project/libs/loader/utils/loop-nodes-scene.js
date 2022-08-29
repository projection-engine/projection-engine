import Entity from "../../engine/production/templates/basic/Entity";
import FilesAPI from "../../../../../libs/files/FilesAPI";
import initializeEntity from "./initialize-entity";
import RegistryAPI from "../../../../../libs/files/RegistryAPI";
import RendererController from "../../engine/production/RendererController";
import {v4} from "uuid";
import GPU from "../../engine/production/GPU";

export default async function loopNodesScene(node, parent, index=0) {
    const children = []
    const exists = RendererController.entitiesMap.get(node.id) != null

    const entity = new Entity(exists ? v4() : node.id)
    entity.name = node.name ? node.name : "entity-" + index
    entity.parent = parent
    parent.children.push(entity)

    for (let m = 0;  m < node.primitives.length; m++) {
        const primitive = node.primitives[m]
        const reg = await RegistryAPI.readRegistryFile(primitive)
        if (reg) {
            const meshData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + reg.path, "json")

            GPU.allocateMesh(reg.id, meshData)
            children.push(initializeEntity(meshData, reg.id, entity, m + index))
        }
    }
    children.push(entity)

    for (let i = 0; i < node.children.length; i++)
        children.push(...(await loopNodesScene(node.children[i], entity, i)))

    return children
}