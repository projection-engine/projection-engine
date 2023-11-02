import FileSystemUtil from "../../../shared/FileSystemUtil"
import EditorActionHistory from "../EditorActionHistory"
import EditorFSUtil from "../../util/EditorFSUtil"
import EngineStore from "../../../shared/stores/EngineStore"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
import SettingsStore from "../../../shared/stores/SettingsStore"
import VisualsStore from "../../../shared/stores/VisualsStore"
import CameraManager from "@engine-core/managers/CameraManager"
import TabsStore from "../../../shared/stores/TabsStore"
import EditorCameraSystem from "../../../../engine/tools/systems/EditorCameraSystem"
import serializeStructure from "../../../../engine/core/utils/serialize-structure"
import ElectronResources from "../../../shared/lib/ElectronResources"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore"
import EntityHierarchyService from "./EntityHierarchyService"
import EntityNamingService from "./EntityNamingService"
import WindowChangeStore from "../../../shared/stores/WindowChangeStore"
import IPCRoutes from "../../../../../shared/enums/IPCRoutes"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import FileTypes from "../../../../../shared/enums/FileTypes"
import AbstractSingleton from "../../../../engine/core/AbstractSingleton"
import EditorUtil from "../../util/EditorUtil"
import TabsStoreUtil from "../../util/TabsStoreUtil"
import EditorEntityManager from "../../../../engine/tools/managers/EditorEntityManager";
import LevelManager from "@engine-core/managers/LevelManager";
import EntityManager from "@engine-core/managers/EntityManager";
import LoadedLevelStore from "../../../shared/stores/LoadedLevelStore";


export default class EditorLevelService extends AbstractSingleton {
    #levelToLoad

    constructor(resolvePromise: Function) {
        super()
        ElectronResources.ipcRenderer.once(
            IPCRoutes.LOAD_PROJECT_METADATA,
            (_, meta) => this.#onLoad(resolvePromise, meta))
        ElectronResources.ipcRenderer.send(IPCRoutes.LOAD_PROJECT_METADATA)
    }

    #onLoad(resolvePromise, meta) {
        if (!meta) {
            ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_LOADING_PROJECT)
            return
        }
        if (meta.settings !== undefined) {
            const newSettings = {...meta.settings}
            newSettings.visualSettings = undefined
            if (meta.layout)
                TabsStore.updateStore({layout: meta.layout})
            if (meta.visualSettings)
                VisualsStore.updateStore(meta.visualSettings)
            SettingsStore.updateStore(newSettings)
        }
        EngineStore.updateStore({
            meta: {...meta, settings: undefined, visualSettings: undefined, layout: undefined},
            isReady: true
        })

        this.#levelToLoad = meta.level
        resolvePromise()
    }

    static getInstance(): EditorLevelService {
        return super.get<EditorLevelService>()
    }

    getLevelToLoad() {
        const old = this.#levelToLoad
        this.#levelToLoad = undefined
        return old
    }

    async loadLevel(levelID?: string) {
        if (!levelID) {
            return
        }

        if (levelID === LevelManager.loadedLevel) {
            ToastNotificationSystem.getInstance().error(LocalizationEN.LEVEL_ALREADY_LOADED)
            return
        }

        if (ChangesTrackerStore.getData().changed && LevelManager.loadedLevel != null) {
            WindowChangeStore.updateStore({
                message: LocalizationEN.UNSAVED_CHANGES,
                callback: async (save: boolean) => {
                    if(save) {
                        await this.save().catch(console.error)
                    }else {
                        this.loadLevel(levelID).catch(console.error)
                    }
                }
            })
            return
        }

        await EditorFSUtil.readRegistry()
        EntityNamingService.clear()
        EditorActionHistory.clear()
        EntitySelectionStore.updateStore({array: [], lockedEntity: undefined})
        const data = JSON.parse(await EditorFSUtil.readAsset(levelID))
        EditorEntityManager.restoreState(data.editorState)
        await LevelManager.loadLevel(data, levelID, false)

        if(EntityManager.getEntities().size > 0) {
            EntitySelectionStore.setLockedEntity(EntityManager.getEntityKeys()[0])
        }
        EntityHierarchyService.updateHierarchy()
        LoadedLevelStore.updateStore({loadedLevel: levelID})
    }

    async save() {
        if (!ChangesTrackerStore.getData().changed)
            return

        if (EngineStore.getData().executingAnimation) {
            ToastNotificationSystem.getInstance().warn(LocalizationEN.EXECUTING_SIMULATION)
            return
        }

        ToastNotificationSystem.getInstance().warn(LocalizationEN.SAVING)
        try {
            const metadata = EngineStore.getData().meta
            const settings = {...SettingsStore.getData()}
            const tabIndexViewport = TabsStoreUtil.getCurrentTabByCurrentView("viewport")
            const viewMetadata = <MutableObject | undefined>settings.views[settings.currentView].viewport[tabIndexViewport]
            if (viewMetadata !== undefined) {
                viewMetadata.cameraMetadata = CameraManager.serializeState()
                const {yaw, pitch} = EditorCameraSystem.getYawPitch()
                viewMetadata.cameraMetadata.prevX = yaw
                viewMetadata.cameraMetadata.prevY = pitch
            }

            await FileSystemUtil.writeFile(
                FileSystemUtil.path + FileSystemUtil.sep + FileTypes.PROJECT,
                JSON.stringify({
                    ...metadata,
                    settings,
                    layout: TabsStore.getData(),
                    visualSettings: VisualsStore.getData(),
                    level: LevelManager.loadedLevel
                }), true)

            await this.saveCurrentLevel().catch(console.error)
        } catch (err) {
            console.error(err)
            return
        }
        ToastNotificationSystem.getInstance().success(LocalizationEN.PROJECT_SAVED)
        await EditorFSUtil.readRegistry()
    }

    async saveCurrentLevel() {
        if (!LevelManager.loadedLevel)
            return

        const assetReg = EditorFSUtil.getRegistryEntry(LevelManager.loadedLevel)
        let path = assetReg?.path

        if (!assetReg) {
            path = FileSystemUtil.resolvePath(await EditorUtil.resolveFileName(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + LevelManager.loadedLevel, FileTypes.LEVEL))
            await EditorFSUtil.createRegistryEntry(LevelManager.loadedLevel, FileSystemUtil.sep + path.split(FileSystemUtil.sep).pop())
            EditorFSUtil.readRegistry().catch(console.error)
        } else {
            path = FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path
        }

        await FileSystemUtil.write(
            path,
            serializeStructure({
                ...LevelManager.serializeState(),
                editorState: EditorEntityManager.serializeState()
            })
        )
        ChangesTrackerStore.updateStore({changed: false})
    }
}



