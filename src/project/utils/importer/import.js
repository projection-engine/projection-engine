import importMesh from "./importMesh"
import EVENTS from "../../../static/misc/EVENTS"
import {ENTITY_ACTIONS} from "../../engine/useEngineEssentials"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import FILE_TYPES from "../../../../public/project/glTF/FILE_TYPES"
import importScript from "./importScript"
import importScene from "./importScene"
import FileSystem from "../files/FileSystem"

export default async function importData(event, fileSystem, engine, setAlert, load, asID) {
    const entities = [], meshes = []
    if (asID)
        entities.push(event)
    else
        try {
            entities.push(...JSON.parse(event.dataTransfer.getData("text")))
        } catch (e) {
            console.error(e)
        }

    for (let i = 0; i < entities.length; i++) {
        const data = entities[i]
        const res = await fileSystem.readRegistryFile(data)
        if(res)
            switch ("."+res.path.split(".").pop()){
            case FILE_TYPES.MESH:
                const meshData = await importMesh(await fileSystem.readFile(fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep +res.path, "json"), engine, data, fileSystem)
                if(meshData.mesh !== undefined)
                    meshes.push(meshData)
                else
                    setAlert({type: "error", message: "Error importing mesh."})
                break
            case FILE_TYPES.TERRAIN:
                break
            case FILE_TYPES.SCRIPT:
                await importScript(fileSystem, engine, res)
                break
            case FILE_TYPES.SCENE:
                await importScene(fileSystem, engine, res, setAlert)
                break
            default:
                setAlert({type: "error", message: "Error importing file."})
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