import FilesAPI from "../fs/FilesAPI"
import EditorActionHistory from "./EditorActionHistory";
import Engine from "../../../../engine-core/Engine";
import RegistryAPI from "../fs/RegistryAPI";
import EngineStore from "../../../shared/stores/EngineStore";
import SelectionStore from "../../../shared/stores/SelectionStore";
import SettingsStore from "../../../shared/stores/SettingsStore";
import VisualsStore from "../../../shared/stores/VisualsStore";
import SETTINGS from "../../static/SETTINGS";
import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import TabsStore from "../../../shared/stores/TabsStore";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import serializeStructure from "../../../../engine-core/utils/serialize-structure";
import FS from "../../../shared/lib/FS/FS";
import ROUTES from "../../../../backend/static/ROUTES";
import PROJECT_STATIC_DATA from "../../../../static/objects/PROJECT_STATIC_DATA";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import ElectronResources from "../../../shared/lib/ElectronResources";
import ErrorLoggerAPI from "../fs/ErrorLoggerAPI";
import AlertController from "../../../shared/components/alert/AlertController";
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore";
import EntityManager from "../EntityManager";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";


export default class LevelController {
    static #initialized = false

    static initialize(): Promise<undefined> {
        return new Promise(resolve => {
            if (LevelController.#initialized) {
                resolve(undefined)
                return
            }
            LevelController.#initialized = true

            ElectronResources.ipcRenderer.once(
                ROUTES.LOAD_PROJECT_METADATA,
                (ev, meta) => {
                    if (!meta) {
                        AlertController.error(LOCALIZATION_EN.ERROR_LOADING_PROJECT)
                        return
                    }
                    if (meta.settings !== undefined) {
                        const newSettings = {...SETTINGS, ...meta.settings}

                        if (newSettings.views[0].top == null)
                            newSettings.views = SETTINGS.views
                        newSettings.visualSettings = undefined
                        if (meta.layout)
                            TabsStore.updateStore(meta.layout)

                        SettingsStore.updateStore(newSettings)
                        if (meta.visualSettings)
                            VisualsStore.updateStore({...meta.visualSettings})
                    }
                    EngineStore.updateStore({
                        ...EngineStore.engine,
                        meta: {...meta, settings: undefined, visualSettings: undefined, layout: undefined},
                        isReady: true
                    })
                    resolve(undefined)
                })
            ElectronResources.ipcRenderer.send(ROUTES.LOAD_PROJECT_METADATA)
        })
    }

    static async loadLevel(level?: string) {
        await RegistryAPI.readRegistry()

        let pathToLevel
        if (!level)
            pathToLevel = FS.path + FS.sep + PROJECT_FOLDER_STRUCTURE.DEFAULT_LEVEL
        else {
            const reg = RegistryAPI.getRegistryEntry(level)
            if (!reg) {
                AlertController.error(LOCALIZATION_EN.ERROR_LOADING_LEVEL)
                return
            }
            pathToLevel = FS.ASSETS_PATH + FS.sep + reg.path
        }
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
        EditorActionHistory.clear()
        const entities = await Engine.loadLevel(pathToLevel, false)
        if (entities.length > 0)
            EntityManager.appendBlock(entities, true)
    }

    static async save() {
        if (!ChangesTrackerStore.data)
            return
        ChangesTrackerStore.updateStore(false)
        if (EngineStore.engine.executingAnimation) {
            AlertController.warn(LOCALIZATION_EN.EXECUTING_SIMULATION)
            return
        }
        await ErrorLoggerAPI.save()
        AlertController.warn(LOCALIZATION_EN.SAVING)
        try {
            const entities = Engine.entities.array
            const metadata = EngineStore.engine.meta
            const settings = {...SettingsStore.data}
            const tabIndexViewport = TabsStore.getValue("viewport")
            const viewMetadata = <MutableObject | undefined>settings.views[settings.currentView].viewport[tabIndexViewport]
            if (viewMetadata !== undefined) {
                viewMetadata.cameraMetadata = CameraAPI.serializeState()
                viewMetadata.cameraMetadata.prevX = CameraTracker.xRotation
                viewMetadata.cameraMetadata.prevY = CameraTracker.yRotation
            }

            await FilesAPI.writeFile(
                FS.path + FS.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION,
                JSON.stringify({
                    ...metadata,
                    settings,
                    layout: TabsStore.data,
                    visualSettings: VisualsStore.data,
                }), true)

            const levels = Array.from(Engine.loadedLevels.map.entries())
            for (let i = 0; i < levels.length; i++) {
                const path = levels[i][0]
                const entity = levels[i][1]
                const serialized = {
                    entity,
                    entities: QueryAPI.getHierarchy(entity),
                    path
                }
                await FilesAPI.writeFile(
                    path,
                    serializeStructure(serialized),
                    true
                )
            }
        } catch (err) {
            console.error(err)
            return
        }
        AlertController.success(LOCALIZATION_EN.PROJECT_SAVED)
    }

}



