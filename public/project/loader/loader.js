import COMPONENTS from "../../../src/project/engine/templates/COMPONENTS";
import FILE_TYPES from "../glTF/FILE_TYPES";
import loadScripts from "./loadScripts";
import loadMeshes from "./loadMeshes";
import loadMaterials from "./loadMaterials";
import {readFile} from "../../events/FSEvents";
import loadData from "./loadData";
import cleanUpRegistry from "./cleanUp";

export default async function loader(projectPath, projectID) {
    await cleanUpRegistry(projectPath)
    const {settings, meta, entities} = await loadData(projectPath)

    let meshes = [...new Set(entities.filter(e => e.data.components[COMPONENTS.MESH]).map(e => e.data.components[COMPONENTS.MESH].meshID))],
        entitiesWithMaterials = entities.map(e => e.data.components[COMPONENTS.MATERIAL]?.materialID).filter(e => e !== undefined),
        entitiesWithScripts = entities.map(e => {
            const comp = e.data.components[COMPONENTS.SCRIPT]
            if (comp) {
                if (comp.registryID) return comp.registryID
                return comp.scripts
            } else return e.data.blueprintID
        }).filter(e => e !== undefined),
        toLoadScripts = [...new Set(entitiesWithScripts.flat())],
        scriptsToLoad = (await loadScripts(toLoadScripts, entities.length, true, projectPath)).filter(e => e !== undefined),
        levelBlueprint = (await readFile(projectPath + '\\levelBlueprint' + FILE_TYPES.SCRIPT))[1],
        meshData = (await loadMeshes(meshes, projectPath)).filter(e => e !== undefined),
        materialsToLoad = (await loadMaterials([...new Set(entitiesWithMaterials)], projectPath)).filter(e => e !== undefined)
    console.log(meshes)
    if (levelBlueprint) {
        levelBlueprint = JSON.parse(levelBlueprint)
        scriptsToLoad.push({
            script: {
                id: projectID,
                executors: levelBlueprint.response,
                name: levelBlueprint.name
            }
        })
    }
    return {
        meta,
        settings,
        entities,
        scripts: scriptsToLoad.map(s => s.script),
        materials: materialsToLoad,
        meshes: meshData
    }
}