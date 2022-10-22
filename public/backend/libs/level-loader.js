import readFile from "shared-resources/backend/utils/read-file";
import loadLevelMeshes from "../utils/load-level-meshes";
import loadLevelMaterials from "../utils/load-level-materials";
import COMPONENTS from "../../engine/static/COMPONENTS.js";
import CHANNELS from "../../../src/data/CHANNELS";

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

    await loadLevelMeshes(
        Array.from(toLoadData.meshes),
        pathToProject,
        (data) => {
            sender.send(CHANNELS.MESH, data)
        }
    )

    await loadLevelMaterials(
        Array.from(toLoadData.materials),
        pathToProject,
        (data) => sender.send(CHANNELS.MATERIAL, data)
    )

}