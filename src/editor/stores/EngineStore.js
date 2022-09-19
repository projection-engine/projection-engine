import ENGINE from "../data/ENGINE";

import FilesAPI from "../../shared/libs/files/FilesAPI"
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import Engine from "../../../public/engine/production/Engine";
import FilesStore from "./FilesStore";
import RegistryAPI from "../../shared/libs/files/RegistryAPI";
import DEFAULT_LEVEL from "../../static/DEFAULT_LEVEL"
import ROUTES from "../../static/ROUTES";
import CHANNELS from "../../static/CHANNELS";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "./templates/dispatch-renderer-entities";
import GPU from "../../../public/engine/production/GPU";
import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";
import {writable} from "svelte/store";
import SettingsStore from "./SettingsStore";
import Entity from "../../../public/engine/production/instances/Entity";
import componentConstructor from "../libs/component-constructor";
import STATIC_TEXTURES from "../../../public/engine/static/resources/STATIC_TEXTURES";
import FALLBACK_MATERIAL from "../../../public/engine/static/FALLBACK_MATERIAL";
import SelectionStore from "./SelectionStore";
import loadMaterial from "../views/inspector/utils/load-material";

const {ipcRenderer} = window.require("electron")

const engine = writable(ENGINE);

export default class EngineStore {
    static engine = ENGINE


    static getStore(onChange) {
        return engine.subscribe(newValue => {
            onChange(newValue)
        })
    }


    static updateStore(value = EngineStore.engine) {
        let updated = {...value}
        EngineStore.engine = updated
        engine.set(updated)
    }


    static saveEntity(entityID, component, key, changeValue) {
        ActionHistoryAPI.pushChange({
            target: ActionHistoryAPI.targets.entity,
            changeValue,
            entityID,
            component,
            key
        })
    }

    static async loadLevel(level) {
        const projectID = sessionStorage.getItem("electronWindowID")
        const IPC = ROUTES.LOAD_LEVEL + projectID
        let pathToLevel
        if (!level) {
            pathToLevel = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
            EngineStore.engine.currentLevel = undefined
        } else {
            const {registryID} = level
            try {
                const reg = await RegistryAPI.readRegistryFile(registryID)
                if (!reg)
                    throw new Error("Error loading level")
                pathToLevel = FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path
                EngineStore.engine.currentLevel = level
            } catch (err) {
                console.error(err)
            }
        }

        GPU.meshes.forEach(m => GPU.destroyMesh(m))
        const materials = Array.from(GPU.materials.entries())
        for (let i = 0; i < materials.length; i++) {
            if (materials[i][0] === FALLBACK_MATERIAL)
                continue
            materials[i][1].delete()
            GPU.materials.delete(materials[i][0])
        }
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
        ActionHistoryAPI.clear()
        ipcRenderer.on(
            CHANNELS.ENTITIES + projectID,
            async (_, data) => {

                const {entities} = data

                const mapped = []
                for (let i = 0; i < entities.length; i++) {

                    const entity = Entity.parseEntityObject(entities[i])
                    for (let i = 0; i < entity.scripts.length; i++)
                        await componentConstructor(entity, entity.scripts[i].id, false)

                    const imgID = entity.components.get(COMPONENTS.SPRITE)?.imageID
                    checkTexture: if (imgID) {
                        const textures = GPU.textures
                        if (textures.get(imgID) != null && Object.values(STATIC_TEXTURES).find(v => v === imgID) != null)
                            break checkTexture
                        await EngineStore.loadTextureFromImageID(imgID)
                    }
                    mapped.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})
            })

        ipcRenderer.on(CHANNELS.MESH + projectID, (ev, data) => GPU.allocateMesh(data.id, data))

        ipcRenderer.on(
            CHANNELS.MATERIAL + projectID,
            async (ev, data) => {
                if (data?.result != null)
                    GPU.allocateMaterial({
                        ...data.result,
                        fragment: data.result.shader,
                        vertex: data.result.vertexShader
                    }, data.id)
                else if (data != null)
                    await loadMaterial(data.id, () => null)
            })

        ipcRenderer.send(IPC, pathToLevel)
    }

    static async save() {
        alert.pushAlert("Saving editor", "info")
        const entities = Engine.entities
        const metaData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + ".meta")
        if (metaData) {
            let pathToWrite
            pathElse:if (!EngineStore.engine.currentLevel)
                pathToWrite = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
            else {
                const reg = await RegistryAPI.readRegistryFile(EngineStore.engine.currentLevel.registryID)
                if (!reg) {
                    alert.pushAlert("Level not found, a new one will be created.", "alert")
                    pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                    break pathElse
                }
                pathToWrite = FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path)
            }

            await SettingsStore.writeSettings(metaData, SettingsStore.data)

            try {
                await FilesAPI.writeFile(
                    pathToWrite,
                    Entity.serializeComplexObject({
                        entities: entities.map(e => e.serializable())
                    }),
                    true
                )
            } catch (err) {
                console.error(err)
                return
            }
            alert.pushAlert(
                "Project saved",
                "success"
            )
            return
        }
        alert.pushAlert("Error saving project", "error")
    }

    static async loadTextureFromImageID(registryID) {
        if (GPU.textures.get(registryID) != null)
            return true

        try {
            const rs = await RegistryAPI.readRegistryFile(registryID)
            const textureData = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path, "json")

            await GPU.allocateTexture({
                ...textureData,
                img: textureData.base64,
                yFlip: textureData.flipY
            }, registryID)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
}



