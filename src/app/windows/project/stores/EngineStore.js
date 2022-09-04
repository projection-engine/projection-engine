import ENGINE from "../data/misc/ENGINE";

import FilesAPI from "../../../libs/files/FilesAPI"
import ActionHistoryAPI from "./ActionHistoryAPI";
import RendererController from "../libs/engine/production/controllers/RendererController";
import FilesStore from "./FilesStore";
import RegistryAPI from "../../../libs/files/RegistryAPI";
import DEFAULT_LEVEL from "../../../../assets/DEFAULT_LEVEL"
import ROUTES from "../../../../assets/ROUTES";
import CHANNELS from "../../../../assets/CHANNELS";
import parseMaterialObject from "../libs/engine/editor/utils/parse-material-object";

import dispatchRendererEntities, {ENTITY_ACTIONS} from "./templates/dispatch-renderer-entities";
import UserInterfaceController from "../libs/engine/production/controllers/UserInterfaceController";
import UIStore from "./UIStore";
import parseUiElement from "../libs/engine/editor/utils/parse-ui-element";
import GPU from "../libs/engine/production/controllers/GPU";
import COMPONENTS from "../libs/engine/production/data/COMPONENTS";
import {writable} from "svelte/store";
import SettingsStore from "./SettingsStore";
import Entity from "../libs/engine/production/templates/Entity";
import componentConstructor from "../libs/component-constructor";
import STATIC_TEXTURES from "../libs/engine/static/STATIC_TEXTURES";

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
                alert.pushAlert("Error loading level.")
            }
        }

        GPU.meshes.forEach(m => GPU.destroyMesh(m))
        EngineStore.engine.materials.forEach(m => m.delete())
        EngineStore.engine.materials = []
        window.renderer.materials = EngineStore.engine.materials

        ipcRenderer.on(
            CHANNELS.ENTITIES + projectID,
            async (_, data) => {
                const {entities, uiElements} = data

                const mapped = []
                console.log(entities)
                for (let i = 0; i < entities.length; i++) {

                    const entity = await Entity.parseEntityObject(entities[i])
                    for (let i = 0; i < entity.scripts.length; i++)
                        await componentConstructor(entity, entity.scripts[i].id, false)

                    const imgID = entity.components[COMPONENTS.SPRITE]?.imageID
                    checkTexture: if (imgID) {
                        const images = GPU.textures
                        if (images.get(imgID) != null && Object.values(STATIC_TEXTURES).find(v => v === imgID) != null)
                            break checkTexture
                        try {
                            const rs = await RegistryAPI.readRegistryFile(imgID)
                            const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path)
                            await GPU.allocateTexture(file, imgID)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    mapped.push(entity)
                }
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})

                if (!uiElements)
                    return
                let newEntities = new Map()
                for (let i = 0; i < uiElements.length; i++)
                    newEntities.set(uiElements[i].id, parseUiElement(uiElements[i]))
                UIStore.updateStore({
                    selected: [],
                    selectedElement: undefined,
                    entities: newEntities
                })
            })

        ipcRenderer.on(CHANNELS.MESH + projectID, (ev, data) => GPU.allocateMesh(data.id, data))

        ipcRenderer.on(
            CHANNELS.MATERIAL + projectID,
            async (ev, data) => {
                EngineStore.engine.materials.push(await parseMaterialObject(data.result, data.id))
                EngineStore.updateStore()
            })

        ipcRenderer.send(IPC, pathToLevel)
    }

    static async save() {
        alert.pushAlert("Saving project", "info")
        const entities = Array.from(RendererController.entitiesMap.values())
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
                    serializeData({
                        entities: entities.map(e => e.serializable()),
                        uiElements: Array.from(UserInterfaceController.entities.values())
                    }),
                    true
                )
            } catch (err) {
                console.error(err)
                alert.pushAlert("Error saving project", "error")
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
        const images = GPU.textures
        if (images.get(registryID) != null)
            return true

        try {
            const rs = await RegistryAPI.readRegistryFile(registryID)
            const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + rs.path)
            await GPU.allocateTexture(file, registryID)
            return true
        } catch (err) {
            console.error(err)
            return false
        }
    }
}

function serializeData(level) {
    return JSON.stringify(
        level,
        (key, value) => {
            if (value instanceof Int8Array ||
                value instanceof Uint8Array ||
                value instanceof Uint8ClampedArray ||
                value instanceof Int16Array ||
                value instanceof Uint16Array ||
                value instanceof Int32Array ||
                value instanceof Uint32Array ||
                value instanceof Float32Array ||
                value instanceof Float64Array)
                return Array.from(value)
            return value
        })
}

