import importMesh from "./importMesh"
import {ENTITY_ACTIONS} from "../../engine-extension/entityReducer"
import {HISTORY_ACTIONS} from "../../hooks/historyReducer"
import FILE_TYPES from "../../../../public/static/FILE_TYPES"
import importScene from "./importScene"
import FileSystem from "../files/FileSystem"
import COMPONENTS from "../../engine/templates/COMPONENTS"
import {vec4} from "gl-matrix"

export default async function importData(event,   engine,  asID) {
    const entities = [], meshes = []

    if (asID)
        entities.push(event)
    else
        try {
            entities.push(...JSON.parse(event.dataTransfer.getData("text")))
        } catch (e) {
            alert.pushAlert("Error importing file", "error")
        }

    for (let i = 0; i < entities.length; i++) {
        const data = entities[i]
        const res = await window.fileSystem.readRegistryFile(data)
        console.trace(res, entities)

        if(res)
            switch ("."+res.path.split(".").pop()){
            case FILE_TYPES.MESH:
                const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + res.path, "json")
                console.dir(file)
                const meshData = await importMesh(file, engine, data)
                if(meshData.mesh !== undefined)
                    meshes.push(meshData)
                else
                    alert.pushAlert("Error importing mesh.", "error")
                break
            case FILE_TYPES.SCENE:
                await importScene(  engine, res)
                break
            default:
                alert.pushAlert("Error importing file.", "error")
                break
            }
    }

    if (meshes.length > 0) {
        const newMeshes = meshes.map(m => !m.existsMesh ? m.mesh : undefined).filter(m => m !== undefined)
        engine.setMeshes(prev => [...prev, ...newMeshes])
        if (!asID) {
            const toLoad = meshes
                .map(m => m.entity)
                .filter(m => m !== undefined)

            const cursorPoint = engine.cursor.components[COMPONENTS.TRANSFORM].translation
            toLoad.forEach(e => {
                if(e.isMesh){
                    const transform = e.components[COMPONENTS.TRANSFORM]
                    const t = vec4.add([], transform.translation, cursorPoint)
                    transform.translation = t
                    console.dir(transform.translation, t)
                    transform.changed = true
                }
            })
            engine.dispatchChanges({
                type: HISTORY_ACTIONS.PUSHING_DATA,
                payload: toLoad
            })
            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toLoad})
            alert.pushAlert( `Meshes loaded (${toLoad.length})`, "success")
        }
    }
}