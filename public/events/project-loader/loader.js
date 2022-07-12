import COMPONENTS from "../../../src/project/engine/templates/COMPONENTS"
import loadMeshes from "./loadMeshes"
import loadMaterials from "./loadMaterials"
import loadData from "./loadData"
import CHANNELS from "../../static/CHANNELS"
import cleanUpRegistry from "./cleanUp"

export default async function loader(projectPath, projectID, listenID, sender) {
    cleanUpRegistry(projectPath, listenID)
    const {settings, meta, entities} = await loadData(projectPath)
    sender.send(CHANNELS.META_DATA + "-" + listenID, {
        meta, settings, entities
    })
    const toLoadData = {
        meshes: new Set(),
        materials: new Set()
    }
    for(let i =0; i < entities.length; i++){
        const {data: current} = entities[i]

        if(!current.components || !current.components[COMPONENTS.MESH])
            continue
        toLoadData.materials.add(current.components[COMPONENTS.MESH].materialID)
        toLoadData.meshes.add(current.components[COMPONENTS.MESH].meshID)
    }

    loadMeshes(Array.from(toLoadData.meshes), projectPath, (data) => sender.send(CHANNELS.MESH + "-" + listenID, data)).catch()
    loadMaterials(Array.from(toLoadData.materials), projectPath, (data) => sender.send(CHANNELS.MATERIAL + "-" + listenID, data)).catch()

}