import COMPONENTS from "../../../src/project/engine/templates/COMPONENTS"
import loadMeshes from "./loadMeshes"
import loadMaterials from "./loadMaterials"
import loadData from "./loadData"
import CHANNELS from "../../static/CHANNELS"

export default async function loader(projectPath, projectID, listenID, sender) {
    // await cleanUpRegistry(projectPath)
    const {settings, meta, entities} = await loadData(projectPath)
    console.trace("ENDING")
    sender.send(CHANNELS.META_DATA + "-" + listenID, {
        meta, settings, entities
    })
    const meshes = [...new Set(entities.filter(e => e.data.components[COMPONENTS.MESH]).map(e => e.data.components[COMPONENTS.MESH].meshID))],
        materials = [...new Set(entities.map(e => e.data.components[COMPONENTS.MATERIAL]?.materialID).filter(e => e !== undefined))]

    loadMeshes(meshes, projectPath, (data) => sender.send(CHANNELS.MESH + "-" + listenID, data)).catch()
    loadMaterials(materials, projectPath, (data) => sender.send(CHANNELS.MATERIAL + "-" + listenID, data)).catch()

}