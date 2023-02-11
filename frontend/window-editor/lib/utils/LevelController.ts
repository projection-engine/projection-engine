import FilesAPI from "../fs/FilesAPI"
import EditorActionHistory from "./EditorActionHistory";
import Engine from "../../../../engine-core/Engine";
import RegistryAPI from "../fs/RegistryAPI";
import EngineStore from "../../../shared/stores/EngineStore";
import SelectionStore from "../../../shared/stores/SelectionStore";
import SettingsStore from "../../../shared/stores/SettingsStore";
import VisualsStore from "../../../shared/stores/VisualsStore";
import SETTINGS from "../../static/SETTINGS";
import LOCALIZATION_EN from "../../../../static/objects/LOCALIZATION_EN";
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI";
import TabsStore from "../../../shared/stores/TabsStore";
import CameraTracker from "../../../../engine-tools/lib/CameraTracker";
import serializeStructure from "../../../../engine-core/utils/serialize-structure";
import FS from "../../../shared/lib/FS/FS";
import ROUTES from "../../../../backend/static/ROUTES";
import PROJECT_FOLDER_STRUCTURE from "../../../../static/objects/PROJECT_FOLDER_STRUCTURE";
import ElectronResources from "../../../shared/lib/ElectronResources";
import ErrorLoggerAPI from "../fs/ErrorLoggerAPI";
import AlertController from "../../../shared/components/alert/AlertController";
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore";
import EngineStateController from "../controllers/EngineStateController";
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI";
import FILE_TYPES from "../../../../static/objects/FILE_TYPES";
import HierarchyController from "../controllers/HierarchyController";
import resolveFileName from "../../utils/resolve-file-name";
import AssetAPI from "../fs/AssetAPI";
import NameController from "../controllers/NameController";


export default class LevelController {
    static #initialized = false
    static #levelToLoad

    static getLevelToLoad() {
        const old = LevelController.#levelToLoad
        LevelController.#levelToLoad = undefined
        return old
    }

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

                    LevelController.#levelToLoad = meta.level
                    resolve(undefined)
                })
            ElectronResources.ipcRenderer.send(ROUTES.LOAD_PROJECT_METADATA)
        })
    }

    static async loadLevel(levelID?: string) {
        if (!levelID || levelID && levelID === Engine.loadedLevel?.id) {
            if(levelID && levelID === Engine.loadedLevel?.id)
                AlertController.error(LOCALIZATION_EN.LEVEL_ALREADY_LOADED)
            return
        }
        if(ChangesTrackerStore.data && Engine.loadedLevel) {
            AlertController.warn(LOCALIZATION_EN.SAVING_PREVIOUS_LEVEL)
            await LevelController.saveCurrentLevel().catch()
        }

        await RegistryAPI.readRegistry()
        NameController.clear()
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [],
            lockedEntity: undefined
        })
        EditorActionHistory.clear()


        const entities = await Engine.loadLevel(levelID, false)
        if (entities.length > 0)
            EngineStateController.appendBlock(entities, true)
        else
            HierarchyController.updateHierarchy()
        if(Engine.loadedLevel)
        SelectionStore.updateStore({
            ...SelectionStore.data,
            TARGET: SelectionStore.TYPES.ENGINE,
            array: [Engine.loadedLevel.id],
            lockedEntity: Engine.loadedLevel.id
        })
    }

    static async save() {
        if (!ChangesTrackerStore.data)
            return

        if (EngineStore.engine.executingAnimation) {
            AlertController.warn(LOCALIZATION_EN.EXECUTING_SIMULATION)
            return
        }

        await ErrorLoggerAPI.save()
        AlertController.warn(LOCALIZATION_EN.SAVING)
        try {
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
                FS.path + FS.sep + FILE_TYPES.PROJECT,
                JSON.stringify({
                    ...metadata,
                    settings,
                    layout: TabsStore.data,
                    visualSettings: VisualsStore.data,
                    level: Engine.loadedLevel?.id
                }), true)

            await LevelController.saveCurrentLevel().catch()
        } catch (err) {
            console.error(err)
            return
        }
        AlertController.success(LOCALIZATION_EN.PROJECT_SAVED)
        await RegistryAPI.readRegistry()
    }

    static async saveCurrentLevel() {
        if (!Engine.loadedLevel)
            return
        const serialized = {
            entity: Engine.loadedLevel.serializable(),
            entities: QueryAPI.getHierarchy(Engine.loadedLevel).map(e => e.serializable()),
        }

        const assetReg = RegistryAPI.getRegistryEntry(Engine.loadedLevel.id)
        let path = assetReg?.path

        if (!assetReg) {
            path = FS.resolvePath(await resolveFileName(FS.ASSETS_PATH + FS.sep + Engine.loadedLevel.name, FILE_TYPES.LEVEL))
            await RegistryAPI.createRegistryEntry(Engine.loadedLevel.id, FS.sep + path.split(FS.sep).pop())
            RegistryAPI.readRegistry().catch()
        } else
            path = FS.ASSETS_PATH + FS.sep + path

        await FS.write(
            path,
            serializeStructure(serialized)
        )
        ChangesTrackerStore.updateStore(false)
    }
}



