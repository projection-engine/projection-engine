import readFile from "shared-resources/backend/utils/read-file";
import loadMeshes from "../utils/level-loader/load-meshes";
import loadMaterials from "../utils/level-loader/load-materials";
import COMPONENTS from "../../engine/static/COMPONENTS.json";
import CHANNELS from "../../../src/static/CHANNELS";

const fs = require("fs");
const DEFAULT = {entities: []}

export default async function levelLoader(sender, levelPath, pathToProject) {
    let level
    try {
        level = (fs.existsSync(levelPath) ? JSON.parse((await readFile(levelPath))[1]) : DEFAULT)
    } catch (err) {
        console.error(err)
        level = DEFAULT
    }
    const entities = level.entities
    sender.send(CHANNELS.ENTITIES, level)
    const toLoadData = {
        meshes: new Set(),
        materials: new Set()
    }
    for (let i = 0; i < entities.length; i++) {
        const current = entities[i]

        if (!current.components || !current.components[COMPONENTS.MESH])
            continue
        toLoadData.materials.add(current.components[COMPONENTS.MESH].materialID)
        toLoadData.meshes.add(current.components[COMPONENTS.MESH].meshID)
    }

    await loadMeshes(
        Array.from(toLoadData.meshes),
        pathToProject,
        (data) => {
            sender.send(CHANNELS.MESH, data)
        }
    )

    await loadMaterials(
        Array.from(toLoadData.materials),
        pathToProject,
        (data) => sender.send(CHANNELS.MATERIAL, data)
    )

}