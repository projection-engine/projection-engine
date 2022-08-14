import {engine} from "./templates/engine-store";
import {settingsStore} from "./templates/settings-store";
import ENGINE from "../data/misc/ENGINE";
import {SETTINGS} from "../../../../assets/WINDOWS";
import FilesAPI from "../../../libs/files/FilesAPI"
import ViewportActions from "./templates/ViewportActions";
import Renderer from "../libs/engine/Renderer";
import AssetAPI from "../../../libs/files/AssetAPI";
import ContentBrowserAPI from "../../../libs/files/ContentBrowserAPI";

let initialized = false
export default class DataStoreController {
    static engine = ENGINE
    static settings = SETTINGS
    static history = new ViewportActions()

    static undo() {
        DataStoreController.history.undo()
    }

    static redo() {
        DataStoreController.history.redo()
    }

    static saveEntity(entityID, component, key, changeValue) {

        DataStoreController.history.pushChange({
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

    static updateSettings(value = DataStoreController.settings) {

        if (initialized) {
            DataStoreController.history.pushChange({
                target: ViewportActions.targets.settings,
                changeValue: DataStoreController.settings
            })
            DataStoreController.history.pushChange({
                target: ViewportActions.targets.settings,
                changeValue: value
            })
        }
        initialized = true
        DataStoreController.settings = value
        settingsStore.set({...value})
    }

    static updateEngine(value = DataStoreController.engine) {
        let updated = {...value}
        if (value.selected.length > 0 || value.lockedEntity)
            updated.selectedEntity = value.entities.get(value.lockedEntity ? value.lockedEntity : value.selected[0])
        else
            updated.selectedEntity = undefined

        DataStoreController.engine = updated
        engine.set(updated)
    }

    static async save() {
        alert.pushAlert("Saving project", "info")
        const entities = Array.from(Renderer.entitiesMap.values())
        const metaData = await FilesAPI.readFile(FilesAPI.path + FilesAPI.sep + ".meta")
        if (metaData) {
            await updateSettings(metaData, DataStoreController.settings)
            await removeDeletedEntities()
            try {

                for (let i = 0; i < entities.length; i++)
                    await AssetAPI.updateEntity(parseEntity(entities[i]), entities[i].id)
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

function parseEntity(entity) {
    return JSON.stringify(
        entity.serializable(),
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
    const meshes = window.renderer.meshes
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