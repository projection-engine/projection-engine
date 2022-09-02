import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities"
import FilesAPI from "../../../../libs/files/FilesAPI"
import {vec4} from "gl-matrix"
import FILE_TYPES from "../../../../../assets/FILE_TYPES";
import CBStoreController from "../../stores/CBStoreController";
import Entity from "../engine/production/templates/Entity";
import loopNodesScene from "./utils/loop-nodes-scene";
import initializeEntity from "./utils/initialize-entity";
import RegistryAPI from "../../../../libs/files/RegistryAPI";
import GPU from "../engine/production/controllers/GPU";
import EditorRenderer from "../engine/editor/EditorRenderer";

export default class Loader {
    static async mesh(objLoaded, id) {
        let mesh,
            entity,
            existsMesh = false,
            material
        try {
            mesh = GPU.meshes.get(objLoaded.id)
            if (!mesh) {
                GPU.allocateMesh(id, objLoaded)
                if (objLoaded.material && !window.renderer.materials.find(m => m.id === objLoaded.material)) {
                    const rs = await RegistryAPI.readRegistryFile(objLoaded.material)
                    if (rs) {
                        const file = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + rs.path, "json")
                        if (file && file.response)
                            material = {
                                ...file.response,
                                id: objLoaded.material
                            }
                    }
                }
            } else
                existsMesh = true
            entity = initializeEntity(objLoaded, mesh.id)
        } catch (e) {
            console.error(e)
            alert.pushAlert("Some error occurred", "error")
        }

        return {
            mesh,
            material,
            entity,
            existsMesh
        }
    }

    static async scene(path, onlyReturn) {
        const file = await FilesAPI.readFile(
            CBStoreController.ASSETS_PATH + FilesAPI.sep + path, "json")

        const entities = []

        try {
            if (file) {
                const folder = new Entity()
                folder.name = path.split(FilesAPI.sep).pop().replace(FILE_TYPES.SCENE, "")

                for (let i = 0; i < file.nodes.length; i++) {
                    const data = await loopNodesScene(file.nodes[i], folder, i)
                    entities.push(...data)
                }
                entities.push(folder)
                if (!onlyReturn) {
                    const cursorPoint = [EditorRenderer.cursor.matrix[12], EditorRenderer.cursor.matrix[13], EditorRenderer.cursor.matrix[14]]
                    entities.forEach(e => {
                        if (e instanceof Entity) {
                            vec4.add(e.translation, e.translation, cursorPoint)
                            e.changed = true
                        }
                    })
                    dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
                }
            } else
                alert.pushAlert("Some error occurred", "error")
        } catch (error) {
            console.error(error)
            alert.pushAlert("Some error occurred", "error")
        }

        return  entities
    }

    static async load(event, asID) {
        const items = [], meshes = []

        if (asID)
            items.push(event)
        else
            try {
                items.push(...JSON.parse(event))
            } catch (e) {
                console.error(e)
                alert.pushAlert("Error loading file", "error")
            }

        for (let i = 0; i < items.length; i++) {
            const data = items[i]
            const res = await RegistryAPI.readRegistryFile(data)
            if (res)
                switch ("." + res.path.split(".").pop()) {
                    case FILE_TYPES.MESH: {
                        const file = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + "assets" + FilesAPI.sep + res.path, "json")
                        const meshData = await Loader.mesh(file, data)
                        if (meshData.mesh !== undefined)
                            meshes.push(meshData)
                        else
                            alert.pushAlert("Error importing mesh.", "error")
                        break
                    }
                    case FILE_TYPES.SCENE:
                        await Loader.scene(res.path)
                        break
                    default:
                        alert.pushAlert("Error importing file.", "error")
                        break
                }
        }

        if (meshes.length > 0) {
            if (!asID) {
                const toLoad = meshes
                    .map(m => m.entity)
                    .filter(m => m !== undefined)
                if (!toLoad.length)
                    return
                const cursorPoint = EditorRenderer.cursor.translation
                toLoad.forEach(e => {
                    if (e) {
                        vec4.add(e.translation, e.translation, cursorPoint)
                        e.changed = true
                    }
                })
                dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toLoad})
                alert.pushAlert(`Meshes loaded (${toLoad.length})`, "success")
            }
        }
    }

}