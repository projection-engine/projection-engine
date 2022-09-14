import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import Engine from "../../../public/engine/production/Engine";
import AssetAPI from "../../shared/libs/files/AssetAPI";
import SETTINGS from "../data/SETTINGS";
import CameraTracker from "../../../public/engine/editor/libs/CameraTracker";
import GPU from "../../../public/engine/production/GPU";
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
        const entities = Array.from(Engine.entitiesMap.values())

        const old = JSON.parse(metaData.toString())
        await AssetAPI.updateProject(
            {
                ...old,
                entities: entities.length,
                meshes: GPU.meshes.size,
                materials: GPU.materials.size,
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

