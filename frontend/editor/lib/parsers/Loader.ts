import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/dispatch-renderer-entities"
import FilesAPI from "../fs/FilesAPI"
import initializeEntity from "./utils/initialize-entity";
import RegistryAPI from "../fs/RegistryAPI";

import EngineStore from "../../stores/EngineStore";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import COMPONENTS from "../../../../engine-core/static/COMPONENTS.js";
import PickingAPI from "../../../../engine-core/lib/utils/PickingAPI";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import UndoRedoAPI from "../utils/UndoRedoAPI";
import EntityConstructor from "../controllers/EntityConstructor";
import GPU from "../../../../engine-core/GPU";
import Entity from "../../../../engine-core/instances/Entity";
import GPUAPI from "../../../../engine-core/lib/rendering/GPUAPI";
import {v4} from "uuid";
import FileSystemAPI from "../../../../engine-core/lib/utils/FileSystemAPI";
import ACTION_HISTORY_TARGETS from "../../../static/ACTION_HISTORY_TARGETS";
import FILE_TYPES from "../../../../static/objects/FILE_TYPES";
import NodeFS from "../../../lib/FS/NodeFS";
import MeshComponent from "../../../../engine-core/templates/components/MeshComponent";
import SpriteComponent from "../../../../engine-core/templates/components/SpriteComponent";
import AlertController from "../../../components/alert/AlertController";


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
        EntityConstructor.translateEntity(root)
        try {
            if (file) {
                for (let i = 0; i < file.entities.length; i++) {
                    const currentEntity = file.entities[i]
                    if (currentEntity.meshID) {
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
                    }
                    const entity = initializeEntity(currentEntity, currentEntity.meshID)
                    entity.parentCache = currentEntity.parent || root.id

                    entities.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entities})
            } else
                console.error("Collection not found")
        } catch (error) {
            console.error(error)
        }
    }

    static async load(event, asID, mouseX?: number, mouseY?: number) {
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
                    const materialID = await Loader.mesh(file, data)
                    const entity = new Entity(undefined, "New primitive")
                    const instance = entity.addComponent<MeshComponent>(COMPONENTS.MESH)
                    entity.addComponent(COMPONENTS.CULLING)
                    instance.materialID = materialID
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
                        const sprite = new Entity(undefined, LOCALIZATION_EN.SPRITE_RENDERER)
                        EntityConstructor.translateEntity(sprite)
                        const c = sprite.addComponent<SpriteComponent>(COMPONENTS.SPRITE)
                        c.imageID = data
                        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: sprite})
                    }
                    break
                }

                case FILE_TYPES.MATERIAL: {
                    const entity = QueryAPI.getEntityByPickerID(PickingAPI.readEntityID(mouseX, mouseY))
                    if (!entity || !entity.meshComponent) return;
                    const result = await FileSystemAPI.loadMaterial(data)
                    if (result) {
                        UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
                        const component = entity.meshComponent
                        component.materialID = data
                        UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
                    } else
                        console.error(LOCALIZATION_EN.SOME_ERROR_OCCURRED + ` (Material: ${data})`)
                    break
                }
                // case FILE_TYPES.TERRAIN: {
                //     await loadTerrain(res)
                //     break
                // }
                default:
                    console.error(new Error("Not valid file type"))
                    break
            }
        }

        if (entitiesToPush.length > 0) {
            dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: entitiesToPush})
            AlertController.success(LOCALIZATION_EN.ENTITIES_CREATED)
        }
    }

}