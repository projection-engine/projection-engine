import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities"
import FilesAPI from "../../../shared/libs/files/FilesAPI"
import {vec4} from "gl-matrix"
import FILE_TYPES from "../../../../static/FILE_TYPES";
import FilesStore from "../../stores/FilesStore";
import Entity from "../../../../../public/engine/production/instances/entity/Entity";
import loopNodesScene from "./utils/loop-nodes-scene";
import initializeEntity from "./utils/initialize-entity";
import RegistryAPI from "../../../shared/libs/files/RegistryAPI";
import GPU from "../../../../../public/engine/production/GPU";
import EngineStore from "../../stores/EngineStore";
import Localization from "../../../shared/libs/Localization";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS";

export default class Loader {
    static async mesh(objLoaded, id, asID) {
        let mesh,
            entity,
            existsMesh = false,
            material
        try {
            mesh = GPU.meshes.get(objLoaded.id)
            if (!mesh) {
                mesh = GPU.allocateMesh(id, objLoaded)
                if (objLoaded.material && !GPU.materials.get(objLoaded.material)) {
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

            entity = asID ? null : initializeEntity(objLoaded, mesh.id)
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
            FilesStore.ASSETS_PATH + FilesAPI.sep + path, "json")

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
                    const cursorPoint = [window.engineCursor.matrix[12], window.engineCursor.matrix[13], window.engineCursor.matrix[14]]
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
                        const meshData = await Loader.mesh(file, data, asID)
                        if (meshData.mesh !== undefined)
                            meshes.push(meshData)
                        else
                            alert.pushAlert("Error importing mesh.", "error")
                        break
                    }
                    case FILE_TYPES.SCENE:
                        await Loader.scene(res.path)
                        break
                    case FILE_TYPES.TEXTURE: {
                        const res = await EngineStore.loadTextureFromImageID(data)
                        if (res) {
                            const sprite = new Entity(undefined, Localization.PROJECT.VIEWPORT.SPRITE_RENDERER)
                            const c = sprite.addComponent(COMPONENTS.SPRITE)
                            c.imageID = data

                            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: sprite})
                        }
                        break
                    }
                    default:
                        console.error(new Error("Not valid file type"))
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
                const cursorPoint = window.engineCursor.translation
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