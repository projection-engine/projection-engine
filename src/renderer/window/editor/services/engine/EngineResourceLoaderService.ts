import FileSystemUtil from "../../../shared/FileSystemUtil"
import EditorFSUtil from "../../util/EditorFSUtil"
import EntityFactoryService from "./EntityFactoryService"
import GPUState from "@engine-core/states/GPUState"
import GPUManager from "@engine-core/managers/GPUManager"

import EngineFileSystemManager from "@engine-core/managers/EngineFileSystemManager"
import MeshComponent from "@engine-core/lib/components/MeshComponent"
import SpriteComponent from "@engine-core/lib/components/SpriteComponent"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import FileTypes from "../../../../../shared/enums/FileTypes"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import EditorEntity from "../../../../engine/tools/EditorEntity"
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";


export default class EngineResourceLoaderService {
    static #initializeEntity(data: MutableObject, meshID: string, parent?: EditorEntity, index?: number) {
        const entity = EntityFactoryService.createMesh(data?.id)
        entity.name = data.name ? data.name : "primitive-" + (index || 0)
        try {
            const comp = entity.getComponent<MeshComponent>(Components.MESH)
            if(parent != null) {
                EntityManager.addParent(entity.id, parent.id)
            }
            const transformationComp = entity.getComponent<TransformationComponent>(Components.MESH)
            for (let i = 0; i < 16; i++)
                transformationComp.baseTransformationMatrix[i] = data.baseTransformationMatrix[i]

            transformationComp.changed = true
            comp.materialID = data.material
            comp.meshID = meshID
            return entity
        } catch (err) {
            console.error(err)
        }
    }

    static async mesh(objLoaded, id) {
        if (!objLoaded)
            return
        let materialID
        if (GPUState.meshes.get(objLoaded.id))
            return
        try {
            GPUManager.allocateMesh(id, objLoaded)
            materialID = objLoaded.material
        } catch (e) {
            console.error(e)
        }
        return materialID
    }

    static async scene(path) {
        const file = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path, "json")
        const root = EntityFactoryService.createEmpty()
        root.name = path.replace(FileTypes.COLLECTION, "").split(FileSystemUtil.sep).pop()
        try {
            if (file) {
                for (let i = 0; i < file.entities.length; i++) {
                    const currentEntity = file.entities[i]
                    const entity = EngineResourceLoaderService.#initializeEntity(currentEntity, currentEntity.meshID)
                    entity.setParent(currentEntity.parent || root.id)
                }
            } else
                ToastNotificationSystem.getInstance().error(LocalizationEN.COLLECTION_NOT_FOUND)
        } catch (error) {
            console.error(error)
        }
    }

    static async load(event, asID:boolean) {
        const items = []

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
            const res = EditorFSUtil.getRegistryEntry(data)
            if (!res)
                continue
            switch ("." + res.path.split(".").pop()) {
                case FileTypes.PRIMITIVE: {
                    const file = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + res.path, "json")
                    const materialID = await EngineResourceLoaderService.mesh(file, data)
                    const entity = EntityFactoryService.createMesh()
                    const mesh = entity.getComponent<MeshComponent>(Components.MESH)
                    entity.name = "New primitive"
                    mesh.materialID = materialID
                    mesh.meshID = data
                    break
                }
                case FileTypes.COLLECTION:
                    await EngineResourceLoaderService.scene(res.path)
                    break
                case FileTypes.TEXTURE: {
                    const entity = EntityFactoryService.createSprite()
                    entity.getComponent<SpriteComponent>(Components.SPRITE).imageID = data
                    entity.name = LocalizationEN.SPRITE_RENDERER
                    break
                }

                case FileTypes.MATERIAL: {
                    // TODO - REWORK MATERIAL DROP
                    // const entity = QueryAPI.getEntityByPickerID(PickingUtil.readEntityID(mouseX, mouseY, 1, StaticFBOState.visibility.FBO))
                    // if (!entity || !entity.meshComponent) return
                    // const result = await EngineFileSystemManager.loadMaterial(data)
                    // if (result) {
                    // 	EditorActionHistory.save(entity)
                    // 	const component = entity.meshComponent
                    // 	component.materialID = data
                    // 	EditorActionHistory.save(entity)
                    // } else
                    // 	console.error(LocalizationEN.SOME_ERROR_OCCURRED + ` (Material: ${data})`)
                    break
                }
            }
            ToastNotificationSystem.getInstance().success(LocalizationEN.ENTITIES_CREATED)
        }
    }

}
