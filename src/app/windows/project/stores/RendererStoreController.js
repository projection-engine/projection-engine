import {engine} from "./templates/engine-store";
import {settingsStore} from "./templates/settings-store";
import ENGINE from "../data/misc/ENGINE";

import FilesAPI from "../../../libs/files/FilesAPI"
import ViewportActions from "./templates/ViewportActions";
import Renderer from "../libs/engine/Renderer";
import AssetAPI from "../../../libs/files/AssetAPI";
import ContentBrowserAPI from "../../../libs/files/ContentBrowserAPI";
import SETTINGS from "../data/misc/SETTINGS";
import CBStoreController from "./CBStoreController";
import RegistryAPI from "../../../libs/files/RegistryAPI";
import DEFAULT_LEVEL from "../../../../assets/DEFAULT_LEVEL"
import ROUTES from "../../../../assets/ROUTES";
import CHANNELS from "../../../../assets/CHANNELS";
import MeshInstance from "../libs/engine/libs/instances/MeshInstance";
import parseMaterialObject from "../utils/parse-material-object";
import parseEntityObject from "../utils/parse-entity-object";
import dispatchRendererEntities, {ENTITY_ACTIONS} from "./templates/dispatch-renderer-entities";
import UIRenderer from "../libs/engine/UIRenderer";
import UIStoreController from "./UIStoreController";
import parseUiElement from "../utils/parse-ui-element";

const {ipcRenderer} = window.require("electron")
let initialized = false
export default class RendererStoreController {
    static engine = ENGINE
    static settings = SETTINGS
    static history = new ViewportActions()

    static undo() {
        RendererStoreController.history.undo()
    }

    static redo() {
        RendererStoreController.history.redo()
    }

    static saveEntity(entityID, component, key, changeValue) {

        RendererStoreController.history.pushChange({
            target: ViewportActions.targets.entity,
            changeValue,
            entityID,
            component,
            key
        })
    }


    static getSettings(onChange) {
        return settingsStore.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static getEngine(onChange) {
        return engine.subscribe(newValue => {
            onChange(newValue)
        })
    }

    static updateSettings(value = RendererStoreController.settings) {

        if (initialized) {
            RendererStoreController.history.pushChange({
                target: ViewportActions.targets.settings,
                changeValue: RendererStoreController.settings
            })
            RendererStoreController.history.pushChange({
                target: ViewportActions.targets.settings,
                changeValue: value
            })
        }
        initialized = true
        console.log(value.viewportTab)
        RendererStoreController.settings = value
        settingsStore.set(value)
    }

    static updateEngine(value = RendererStoreController.engine) {
        let updated = {...value}
        if (value.selected.length > 0 || value.lockedEntity)
            updated.selectedEntity = value.entities.get(value.lockedEntity ? value.lockedEntity : value.selected[0])
        else
            updated.selectedEntity = undefined

        RendererStoreController.engine = updated
        engine.set(updated)
    }

    static async loadLevel(level) {
        const projectID = sessionStorage.getItem("electronWindowID")
        const IPC = ROUTES.LOAD_LEVEL + projectID
        let pathToLevel
        if (!level) {
            pathToLevel = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
            RendererStoreController.engine.currentLevel = undefined
        } else {
            const {registryID} = level
            try {
                const reg = await RegistryAPI.readRegistryFile(registryID)
                if (!reg)
                    throw new Error("Error loading level")
                pathToLevel = CBStoreController.ASSETS_PATH + FilesAPI.sep + reg.path
                RendererStoreController.engine.currentLevel = level
            } catch (err) {
                console.error(err)
                alert.pushAlert("Error loading level.")
            }
        }

        RendererStoreController.engine.meshes.forEach(m => m.delete())
        RendererStoreController.engine.meshes = new Map()
        Renderer.meshes = RendererStoreController.engine.meshes
        RendererStoreController.engine.materials.forEach(m => m.delete())
        RendererStoreController.engine.materials = []
        window.renderer.materials = RendererStoreController.engine.materials

        ipcRenderer.on(
            CHANNELS.ENTITIES + projectID,
            async (_, data) => {
                const {entities, uiElements} = data

                const mapped = []

                for (let i = 0; i < entities.length; i++)
                    mapped.push(await parseEntityObject(entities[i]))
                dispatchRendererEntities({type: ENTITY_ACTIONS.DISPATCH_BLOCK, payload: mapped})

                if (!uiElements)
                    return
                let newEntities = new Map()
                for (let i = 0; i < uiElements.length; i++)
                    newEntities.set(uiElements[i].id, parseUiElement(uiElements[i]))
                UIStoreController.updateStore({
                    selected: [],
                    selectedElement: undefined,
                    entities: newEntities
                })
            })

        ipcRenderer.on(
            CHANNELS.MESH + projectID,
            (ev, data) => {

                const mesh = new MeshInstance(data)
                RendererStoreController.engine.meshes.set(mesh.id, mesh)
                RendererStoreController.updateEngine()
            })

        ipcRenderer.on(
            CHANNELS.MATERIAL + projectID,
            async (ev, data) => {
                RendererStoreController.engine.materials.push(await parseMaterialObject(data.result, data.id))
                RendererStoreController.updateEngine()
            })

        ipcRenderer.send(IPC, pathToLevel)
    }

    static async save() {
        alert.pushAlert("Saving project", "info")
        const entities = Array.from(Renderer.entitiesMap.values())
        const metaData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + ".meta")
        if (metaData) {
            let pathToWrite
            pathElse:if (!RendererStoreController.engine.currentLevel)
                pathToWrite = FilesAPI.path + FilesAPI.sep + DEFAULT_LEVEL
            else {
                const reg = await RegistryAPI.readRegistryFile(RendererStoreController.engine.currentLevel.registryID)
                if (!reg) {
                    alert.pushAlert("Level not found, a new one will be created.", "alert")
                    pathToWrite = (new Date()).toDateString() + " (fallback-level).level"
                    break pathElse
                }
                pathToWrite = FilesAPI.resolvePath(CBStoreController.ASSETS_PATH + FilesAPI.sep + reg.path)
            }

            await updateSettings(metaData, RendererStoreController.settings)

            try {
                await FilesAPI.writeFile(
                    pathToWrite,
                    serializeData({
                        entities: entities.map(e => e.serializable()),
                        uiElements: Array.from(UIRenderer.entities.values())
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

async function updateSettings(metaData, settings) {
    const entities = window.renderer.entities
    const meshes = Renderer.meshes
    const materials = window.renderer.materials
    const old = JSON.parse(metaData.toString())
    await AssetAPI.updateProject(
        {
            ...old,
            entities: entities.length,
            meshes: meshes.length,
            materials: materials.length,
            lastModification: (new Date()).toDateString(),
            creation: settings.creationDate
        },
        {
            ...settings,
            cameraPosition: window.renderer.camera.centerOn,
            yaw: window.renderer.camera.yaw,
            pitch: window.renderer.camera.pitch,
        }
    )
}

async function removeDeletedEntities() {
    const LOGIC_PATH = FilesAPI.path + FilesAPI.sep + "logic" + FilesAPI.sep
    const allEntities = await ContentBrowserAPI.fromDirectory(FilesAPI.path + FilesAPI.sep + "logic", ".entity")
    const all = await Promise.all(allEntities.map(e => FilesAPI.readFile(LOGIC_PATH + e, "json", true)))
    for (let i = 0; i < all.length; i++) {
        const entity = all[i]
        if (!entity || Renderer.entitiesMap.get(entity.id))
            continue
        await FilesAPI.deleteFile(LOGIC_PATH + entity.id + ".entity")
    }
}