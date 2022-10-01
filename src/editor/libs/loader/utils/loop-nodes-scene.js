import FilesAPI from "../../../../shared/libs/FilesAPI";
import initializeEntity from "./initialize-entity";
import RegistryAPI from "../../../../shared/libs/RegistryAPI";
import {v4} from "uuid";
import {Entity, FALLBACK_MATERIAL, GPU} from "../../../../../public/engine/production";
import QueryAPI from "../../../../../public/engine/production/apis/utils/QueryAPI";
import FilesStore from "../../../stores/FilesStore";
import loadMaterial from "./load-material";

export default async function loopNodesScene(node, parent, index = 0) {
    const children = []
    const exists = QueryAPI.getEntityByID(node.id) != null

    const entity = new Entity(exists ? v4() : node.id)
    entity.name = node.name ? node.name : "entity-" + index
    entity.parent = parent
    parent.children.push(entity)

    for (let m = 0; m < node.primitives.length; m++) {
        const primitive = node.primitives[m]
        const reg = await RegistryAPI.readRegistryFile(primitive)
        if (reg) {
            const meshData = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path, "json")
            if(!meshData)
                continue
            if (meshData.material != null)
                await loadMaterial(meshData.material, (data) => meshData.material = data)
            else
                meshData.material = FALLBACK_MATERIAL
            GPU.allocateMesh(reg.id, meshData)

            children.push(initializeEntity(meshData, reg.id, entity, m + index))
        }
    }
    children.push(entity)

    for (let i = 0; i < node.children.length; i++)
        children.push(...(await loopNodesScene(node.children[i], entity, i)))

    return children
}