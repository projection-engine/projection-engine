import importMesh from "./importMesh";
import EVENTS from "../EVENTS";
import {ENTITY_ACTIONS} from "../../engine/useEngineEssentials";
import {HISTORY_ACTIONS} from "../../hooks/historyReducer";
import FILE_TYPES from "../../../../public/project/glTF/FILE_TYPES";
import importScript from "./importScript";

export default async function handleDrop(event, fileSystem, engine, setAlert, load, asID, isBlueprint) {
    const entities = [], meshes = []
    if (asID)
        entities.push(event)
    else
        try {
            entities.push(...JSON.parse(event.dataTransfer.getData("text")))
        } catch (e) {
        }

    for (let i = 0; i < entities.length; i++) {
        const data = entities[i]
        const res = await fileSystem.readRegistryFile(data)
        if(res)
        switch ('.'+res.path.split('.').pop()){
            case FILE_TYPES.MESH:
                const mesh = await fileSystem.readFile(fileSystem.path + '\\assets\\' + res.path, 'json')
                meshes.push(await importMesh(mesh, engine, data, i, fileSystem, isBlueprint))
                break
            case FILE_TYPES.TERRAIN:
                break
            case FILE_TYPES.SCRIPT:
                await importScript(fileSystem, engine, res)
                break
            case FILE_TYPES.SCENE:
                break
            default:
                setAlert({type: 'error', message: 'Error importing file.'})
                break
        }


    }

    if (meshes.length > 0) {
        engine.setMeshes(prev => [...prev, ...meshes
            .map(m => !m.existsMesh ? m.mesh : undefined)
            .filter(m => m !== undefined)])
        if (!asID) {
            const toLoad = meshes
                .map(m => m.entity)
                .filter(m => m !== undefined)
            engine.dispatchChanges({
                type: HISTORY_ACTIONS.PUSHING_DATA,
                payload: toLoad
            })
            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toLoad})
        }
        load.finishEvent(EVENTS.LOADING_MESHES)
    }
}