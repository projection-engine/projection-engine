import ActionHistoryAPI from "./ActionHistoryAPI";
import RendererController from "../libs/engine/production/controllers/RendererController";
import AssetAPI from "../../../libs/files/AssetAPI";
import SETTINGS from "../data/misc/SETTINGS";
import CameraTracker from "../libs/engine/editor/libs/CameraTracker";
import GPU from "../libs/engine/production/controllers/GPU";
import {get, writable} from "svelte/store";

let initialized = false

const settingsStore = writable(SETTINGS);

export default class SettingsStore {
    static data = get(settingsStore)

    static getStore(onChange) {
        return settingsStore.subscribe(newValue => onChange(newValue))
    }

    static updateStore(value = SettingsStore.data, noSaving) {

        if (!noSaving && initialized) {
            ActionHistoryAPI.pushChange({
                target: ActionHistoryAPI.targets.settings,
                changeValue: SettingsStore.data
            })
            ActionHistoryAPI.pushChange({
                target: ActionHistoryAPI.targets.settings,
                changeValue: value
            })
        }
        initialized = true
        SettingsStore.data = value
        settingsStore.set(value)
    }

    static async writeSettings(metaData, settings) {
        const entities = Array.from(RendererController.entitiesMap.values())
        const materials = window.renderer.materials
        const old = JSON.parse(metaData.toString())
        await AssetAPI.updateProject(
            {
                ...old,
                entities: entities.length,
                meshes: GPU.meshes.size,
                materials: materials.length,
                lastModification: (new Date()).toDateString(),
                creation: settings.creationDate
            },
            {
                ...settings,
                cameraPosition: CameraTracker.centerOn,
                yaw: CameraTracker.yaw,
                pitch: CameraTracker.pitch,
            }
        )
    }


}

