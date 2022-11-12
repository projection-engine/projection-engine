import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities"
import FilesAPI from "../FilesAPI"
import FILE_TYPES from "shared-resources/FILE_TYPES";
import initializeEntity from "./utils/initialize-entity";
import RegistryAPI from "../RegistryAPI";

import EngineStore from "../../stores/EngineStore";
import Localization from "../../templates/LOCALIZATION_EN";
import LOCALIZATION_EN from "../../templates/LOCALIZATION_EN";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.js";
import PickingAPI from "../../../public/engine/api/utils/PickingAPI";
import QueryAPI from "../../../public/engine/api/utils/QueryAPI";
import ActionHistoryAPI from "../ActionHistoryAPI";
import EntityConstructor from "../EntityConstructor";
import loadTerrain from "./utils/load-terrain";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import GPU from "../../../public/engine/GPU";
import Entity from "../../../public/engine/instances/Entity";
import GPUAPI from "../../../public/engine/api/GPUAPI";
import {v4} from "uuid";
import FALLBACK_MATERIAL from "../../../public/engine/static/FALLBACK_MATERIAL";
import FileSystemAPI from "../../../public/engine/api/FileSystemAPI";
import {vec3, vec4} from "gl-matrix";
import CameraAPI from "../../../public/engine/api/CameraAPI";
import ACTION_HISTORY_TARGETS from "../../static/ACTION_HISTORY_TARGETS";

let translationCache = vec3.create()
let rotationCache = vec4.create()
export default class Loader {
    static async mesh(objLoaded, id) {
        if (!objLoaded)
            return
        let materialID
        if (GPU.meshes.get(objLoaded.id))
            return
        try {
            GPUAPI.allocateMesh(id, objLoaded)
            const result = await FileSystemAPI.loadMaterial(objLoaded.material)
            if (result)
                materialID = objLoaded.material
        } catch (e) {
            console.error(e)
        }
        return materialID
    }

    static async scene(path) {
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + path, "json")
        const entities = []
        const root = new Entity(v4(), path.replace(FILE_TYPES.COLLECTION, "").split(NodeFS.sep).pop())
        entities.push(root)
        vec3.copy(translationCache, CameraAPI.translationBuffer)
        vec4.copy(rotationCache, CameraAPI.rotationBuffer)
        try {
            if (file) {
                const folder = new Entity()
                folder.name = file.name
                for (let i = 0; i < file.entities.length; i++) {
                    const currentEntity = file.entities[i]
                    const primitiveRegistry = RegistryAPI.getRegistryEntry(currentEntity.meshID)
                    if (primitiveRegistry) {
                        const meshData = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + primitiveRegistry.path, "json")
                        if (!meshData)
                            continue
                        const result = await FileSystemAPI.loadMaterial(meshData.material)
                        if (result)
                            currentEntity.material = meshData.material

                        GPUAPI.allocateMesh(primitiveRegistry.id, meshData)
                    }
                    const entity = initializeEntity(currentEntity, currentEntity.meshID)
                    entity.parentCache = currentEntity.parent || root.id
                    EntityConstructor.translateEntity(entity, rotationCache, translationCache)
                    entities.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
            } else
                console.error("Collection not found")
        } catch (error) {
            console.error(error)
        }
    }

    static async load(event, asID, mouseX, mouseY) {
        const items = [], entitiesToPush = []

        if (asID)
            items.push(event)
        else
            try {
                items.push(...JSON.parse(event))
            } catch (e) {
                console.error(e)
            }
        for (let i = 0; i < items.length; i++) {
            const data = items[i]
            if (!data)
                continue
            const res = RegistryAPI.getRegistryEntry(data)
            if (!res)
                continue
            switch ("." + res.path.split(".").pop()) {
                case FILE_TYPES.PRIMITIVE: {
                    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")
                    const materialID = await Loader.mesh(file, data, asID)
                    const entity = new Entity(undefined, "New primitive")
                    const instance = entity.addComponent(COMPONENTS.MESH)
                    instance.materialID = materialID || FALLBACK_MATERIAL
                    instance.meshID = data
                    EntityConstructor.translateEntity(entity)
                    entitiesToPush.push(entity)

                    break
                }
                case FILE_TYPES.COLLECTION:
                    await Loader.scene(res.path)
                    break
                case FILE_TYPES.TEXTURE: {
                    const res = await EngineStore.loadTextureFromImageID(data)
                    if (res) {
                        const sprite = new Entity(undefined, Localization.SPRITE_RENDERER)
                        EntityConstructor.translateEntity(sprite)
                        const c = sprite.addComponent(COMPONENTS.SPRITE)
                        c.imageID = data
                        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: sprite})
                    }
                    break
                }
                case FILE_TYPES.SIMPLE_MATERIAL:
                case FILE_TYPES.MATERIAL_INSTANCE:
                case FILE_TYPES.TERRAIN_MATERIAL:
                case FILE_TYPES.MATERIAL: {
                    const entity = QueryAPI.getEntityByPickerID(PickingAPI.readEntityID(mouseX, mouseY))
                    if (!entity || !entity.components.get(COMPONENTS.MESH)) return;
                    const result = await FileSystemAPI.loadMaterial(data)
                    if (result) {
                        const comp = entity.components.get(COMPONENTS.TERRAIN) ? COMPONENTS.TERRAIN : COMPONENTS.MESH
                        ActionHistoryAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
                        entity.components.get(comp).materialID = data
                        ActionHistoryAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
                    } else
                        alert.pushAlert(LOCALIZATION_EN.SOME_ERROR_OCCURRED + ` (Material: ${data})`)
                    break
                }
                case FILE_TYPES.TERRAIN: {
                    await loadTerrain(res)

                    break
                }
                default:
                    console.error(new Error("Not valid file type"))
                    break
            }
        }

        if (entitiesToPush.length > 0) {
            dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entitiesToPush})
            alert.pushAlert(`Entities created`, "success")
        }
    }

}