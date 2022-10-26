import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities"
import FilesAPI from "../FilesAPI"
import FILE_TYPES from "shared-resources/FILE_TYPES";
import initializeEntity from "./utils/initialize-entity";
import RegistryAPI from "../RegistryAPI";

import EngineStore from "../../stores/EngineStore";
import Localization from "../../templates/LOCALIZATION_EN";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.js";
import loadMaterial from "./utils/load-material";
import PickingAPI from "../../../public/engine/api/utils/PickingAPI";
import QueryAPI from "../../../public/engine/api/utils/QueryAPI";
import ActionHistoryAPI from "../ActionHistoryAPI";
import EntityConstructor from "../EntityConstructor";
import loadTerrain from "./utils/load-terrain";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import GPUResources from "../../../public/engine/GPUResources";
import Entity from "../../../public/engine/instances/Entity";
import GPUController from "../../../public/engine/GPUController";
import {v4} from "uuid";

export default class Loader {
    static async mesh(objLoaded, id, asID) {
        let mesh,
            entity,
            existsMesh = false,
            material
        try {
            mesh = GPUResources.meshes.get(objLoaded.id)
            if (!mesh) {

                mesh = GPUController.allocateMesh(id, objLoaded)
                await loadMaterial(
                    objLoaded.material,
                    data => objLoaded.material = data
                )
            } else
                existsMesh = true
            entity = asID ? null : initializeEntity(objLoaded, mesh.id)
        } catch (e) {
            console.error(e)
            alert.pushAlert("Some error occurred", "error")
        }

        return {
            mesh,
            entity,
            existsMesh
        }
    }

    static async scene(path) {
        const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + path, "json")
        const entities = []
        const root = new Entity(v4(), path.replace(FILE_TYPES.COLLECTION, "").split(NodeFS.sep).pop())
        entities.push(root)
        try {
            if (file) {
                const folder = new Entity()
                folder.name = file.name
                for (let i = 0; i < file.entities.length; i++) {
                    const currentEntity = file.entities[i]
                    const primitiveRegistry = await RegistryAPI.readRegistryFile(currentEntity.meshID)
                    if (primitiveRegistry) {
                        const meshData = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + primitiveRegistry.path, "json")
                        if (!meshData)
                            continue
                        await loadMaterial(
                            meshData.material,
                            data => currentEntity.material = data)
                        GPUController.allocateMesh(primitiveRegistry.id, meshData)
                    }
                    const entity = initializeEntity(currentEntity, currentEntity.meshID)
                    entity.parentCache = currentEntity.parent || root.id
                    EntityConstructor.translateEntity(entity)
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
        const items = [], meshes = []

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
            const res = await RegistryAPI.readRegistryFile(data)
            if (!res)
                continue
            switch ("." + res.path.split(".").pop()) {
                case FILE_TYPES.PRIMITIVE: {
                    const file = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + res.path, "json")
                    const meshData = await Loader.mesh(file, data, asID)
                    if (!meshData) continue
                    if (meshData.mesh !== undefined)
                        meshes.push(meshData)
                    else
                        alert.pushAlert("Error importing mesh.", "error")
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

                    await loadMaterial(
                        data,
                        (matID) => {
                            const comp = entity.components.get(COMPONENTS.TERRAIN) ? COMPONENTS.TERRAIN : COMPONENTS.MESH
                            ActionHistoryAPI.pushChange({
                                target: ActionHistoryAPI.targets.entity,
                                entityID: entity.id,
                                component: comp,
                                key: "materialID",
                                changeValue: entity.components.get(comp).materialID
                            })
                            entity.components.get(comp).materialID = matID
                            ActionHistoryAPI.pushChange({
                                target: ActionHistoryAPI.targets.entity,
                                entityID: entity.id,
                                component: comp,
                                key: "materialID",
                                changeValue: data
                            })
                        })
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

        if (meshes.length > 0 && !asID) {
            const toLoad = meshes.map(m => m.entity).filter(m => m != null)
            if (!toLoad.length)
                return
            for (let i = 0; i < toLoad.length; i++) {
                const entity = toLoad[i]
                EntityConstructor.translateEntity(entity)
            }
            dispatchRendererEntities({type: ENTITY_ACTIONS.PUSH_BLOCK, payload: toLoad})
            alert.pushAlert(`Meshes loaded (${toLoad.length})`, "success")
        }
    }

}