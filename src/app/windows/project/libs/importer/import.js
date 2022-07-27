import importMesh from "./importMesh"
import {ENTITY_ACTIONS} from "../engine-extension/entityReducer"
import importScene from "./importScene"
import FileSystem from "../FileSystem"
import COMPONENTS from "../engine/data/COMPONENTS"
import {vec4} from "gl-matrix"
import FILE_TYPES from "../../../../../electron/static/FILE_TYPES";

export default async function importData(event, engine, asID) {
    const items = [], meshes = []

    if (asID)
        items.push(event)
    else
        try {
            items.push(...JSON.parse(event.dataTransfer.getData("text")))
        } catch (e) {
            alert.pushAlert("Error importing file", "error")
        }

    for (let i = 0; i < items.length; i++) {
        const data = items[i]
        const res = await window.fileSystem.readRegistryFile(data)
        if (res)
            switch ("." + res.path.split(".").pop()) {
            case FILE_TYPES.MESH: {
                const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + res.path, "json")
                const meshData = await importMesh(file, engine, data)
                if (meshData.mesh !== undefined)
                    meshes.push(meshData)
                else
                    alert.pushAlert("Error importing mesh.", "error")
                break
            }
            case FILE_TYPES.SCENE:
                await importScene(engine, res)
                break
            default:
                alert.pushAlert("Error importing file.", "error")
                break
            }
    }

    if (meshes.length > 0) {
        const newMeshes = meshes.map(m => !m.existsMesh ? m.mesh : undefined).filter(m => m !== undefined)
        for(let i = 0; i < newMeshes.length; i++)
            engine.meshes.set(newMeshes[i].id, newMeshes[i])
        if (!asID) {
            const toLoad = meshes
                .map(m => m.entity)
                .filter(m => m !== undefined)

            const cursorPoint = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
            toLoad.forEach(e => {
                if (e.components && e.components[COMPONENTS.TRANSFORM]) {
                    const transform = e.components[COMPONENTS.TRANSFORM]
                    vec4.add(transform.translation, transform.translation, cursorPoint)
                    transform.changed = true
                }
            })
            engine.dispatchEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toLoad})
            alert.pushAlert(`Meshes loaded (${toLoad.length})`, "success")
        }
    }
}