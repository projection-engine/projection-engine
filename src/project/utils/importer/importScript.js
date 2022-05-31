import COMPONENTS from "../../engine/templates/COMPONENTS"
import ProjectLoader from "../workers/ProjectLoader"
import Entity from "../../engine/basic/Entity"
import FolderComponent from "../../engine/components/FolderComponent"
import ScriptComponent from "../../engine/components/ScriptComponent"
import {HISTORY_ACTIONS} from "../hooks/historyReducer"
import {ENTITY_ACTIONS} from "../../engine/useEngineEssentials"

export default async function importScript(fileSystem, engine, res) {
    const script = await fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
    const meshesToLoad = script.entities.map(e => e.components[COMPONENTS.MESH]?.meshID).filter(e => e)
    const m = await ProjectLoader.loadMeshes(meshesToLoad, fileSystem, engine.gpu)

    const folder = new Entity()
    folder.id = res.id
    folder.name = script.name
    folder.isBlueprint = true
    folder.components[COMPONENTS.FOLDER] = new FolderComponent(undefined, script.name)

    const entities = []
    for (let i = 0; i < script.entities.length; i++) {
        const ee = await ProjectLoader.mapEntity(script.entities[i], i, fileSystem, engine.gpu)
        ee.id = script.entities[i].id
        ee.linkedTo = res.id
        if (ee.components[COMPONENTS.MESH])
            ee.components[COMPONENTS.MESH].meshID = m[0].id
        ee.components[COMPONENTS.SCRIPT] = new ScriptComponent()
        ee.components[COMPONENTS.SCRIPT].registryID = res.id
        entities.push(ee)
    }

    engine.setScripts(prev => {
        return [...prev, {
            executors: script.response,
            id: res.id,
            name: script.name
        }]
    })
    engine.setMeshes([...engine.meshes, ...m])
    engine.dispatchChanges({type: HISTORY_ACTIONS.PUSHING_DATA, payload: [...entities, folder]})
    engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: [...entities, folder]})
}