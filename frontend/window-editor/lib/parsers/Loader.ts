import FilesAPI from "../fs/FilesAPI"
import initializeEntity from "./initialize-entity";
import RegistryAPI from "../fs/RegistryAPI";
import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
import COMPONENTS from "../../../../engine-core/static/COMPONENTS";
import PickingAPI from "../../../../engine-core/lib/utils/PickingAPI";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import EditorActionHistory from "../utils/EditorActionHistory";
import EntityFactory from "../controllers/EntityFactory";
import GPU from "../../../../engine-core/GPU";
import GPUAPI from "../../../../engine-core/lib/rendering/GPUAPI";

import FileSystemAPI from "../../../../engine-core/lib/utils/FileSystemAPI";
import FILE_TYPES from "../../../../static/objects/FILE_TYPES";
import FS from "../../../shared/lib/FS/FS";
import MeshComponent from "../../../../engine-core/instances/components/MeshComponent";
import SpriteComponent from "../../../../engine-core/instances/components/SpriteComponent";
import AlertController from "../../../shared/components/alert/AlertController";
import EngineStateController from "../controllers/EngineStateController";
import EntityAPI from "../../../../engine-core/lib/utils/EntityAPI";


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
        const file = await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + path, "json")
        const entities = []
        const root = EntityAPI.getNewEntityInstance()
        root.name = path.replace(FILE_TYPES.COLLECTION, "").split(FS.sep).pop()
        entities.push(root)
        EntityFactory.translateEntity(root)
        try {
            if (file) {
                for (let i = 0; i < file.entities.length; i++) {
                    const currentEntity = file.entities[i]
                    const entity = initializeEntity(currentEntity, currentEntity.meshID)
                    entity.parentID = currentEntity.parent || root.id
                    entities.push(entity)
                }
                EngineStateController.appendBlock(entities)
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
                    const file = await FilesAPI.readFile(FS.ASSETS_PATH + FS.sep + res.path, "json")
                    const materialID = await Loader.mesh(file, data)
                    const entity = EntityAPI.getNewEntityInstance()
                    entity.name = "New primitive"
                    const instance = entity.addComponent<MeshComponent>(COMPONENTS.MESH)
                    entity.addComponent(COMPONENTS.CULLING)
                    instance.materialID = materialID
                    instance.meshID = data
                    EntityFactory.translateEntity(entity)
                    entitiesToPush.push(entity)

                    break
                }
                case FILE_TYPES.COLLECTION:
                    await Loader.scene(res.path)
                    break
                case FILE_TYPES.TEXTURE: {
                    if(data)
                    await FileSystemAPI.loadTexture(data)
                    const sprite = EntityAPI.getNewEntityInstance()
                    sprite.name = LOCALIZATION_EN.SPRITE_RENDERER
                    EntityFactory.translateEntity(sprite)
                    sprite.addComponent<SpriteComponent>(COMPONENTS.SPRITE).imageID = data
                    EngineStateController.add(sprite)
                    break
                }

                case FILE_TYPES.MATERIAL: {
                    const entity = QueryAPI.getEntityByPickerID(PickingAPI.readEntityID(mouseX, mouseY))
                    if (!entity || !entity.meshComponent) return;
                    const result = await FileSystemAPI.loadMaterial(data)
                    if (result) {
                        EditorActionHistory.save(entity)
                        const component = entity.meshComponent
                        component.materialID = data
                        EditorActionHistory.save(entity)
                    } else
                        console.error(LOCALIZATION_EN.SOME_ERROR_OCCURRED + ` (Material: ${data})`)
                    break
                }
                default:
                    console.error(new Error("Not valid file type"))
                    break
            }
        }

        if (entitiesToPush.length > 0) {
            EngineStateController.appendBlock(entitiesToPush)
            AlertController.success(LOCALIZATION_EN.ENTITIES_CREATED)
        }
    }

}