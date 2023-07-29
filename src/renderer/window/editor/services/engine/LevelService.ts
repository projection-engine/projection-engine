import FileSystemUtil from "../../../shared/FileSystemUtil"
import EditorActionHistory from "../EditorActionHistory"
import Engine from "../../../../engine/core/Engine"
import EditorFSUtil from "../../util/EditorFSUtil"
import EngineStore from "../../../shared/stores/EngineStore"
import EntitySelectionStore from "../../../shared/stores/EntitySelectionStore"
import SettingsStore from "../../../shared/stores/SettingsStore"
import VisualsStore from "../../../shared/stores/VisualsStore"
import CameraAPI from "../../../../engine/core/lib/utils/CameraAPI"
import TabsStore from "../../../shared/stores/TabsStore"
import CameraTracker from "../../../../engine/tools/utils/CameraTracker"
import serializeStructure from "../../../../engine/core/utils/serialize-structure"
import ElectronResources from "../../../shared/lib/ElectronResources"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore"
import QueryAPI from "../../../../engine/core/lib/utils/QueryAPI"
import EntityHierarchyService from "./EntityHierarchyService"
import EntityNamingService from "./EntityNamingService"
import PickingAPI from "../../../../engine/core/lib/utils/PickingAPI"
import AXIS from "../../../../engine/tools/static/AXIS"
import WindowChangeStore from "../../../shared/stores/WindowChangeStore"
import IPCRoutes from "../../../../../shared/enums/IPCRoutes"
import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
import FileTypes from "../../../../../shared/enums/FileTypes"
import AbstractSingleton from "../../../../../shared/AbstractSingleton"
import EditorUtil from "../../util/EditorUtil"
import TabsStoreUtil from "../../util/TabsStoreUtil"
import ViewStateStore from "../../../shared/stores/ViewStateStore";


export default class LevelService extends AbstractSingleton {
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

    static getInstance(): LevelService {
        return super.get<LevelService>()
    }

    getLevelToLoad() {
        const old = this.#levelToLoad
        this.#levelToLoad = undefined
        return old
    }

    async loadLevel(levelID?: string) {
        if (!levelID || levelID && levelID === Engine.loadedLevel?.id) {
            if (levelID && levelID === Engine.loadedLevel?.id)
                ToastNotificationSystem.getInstance().error(LocalizationEN.LEVEL_ALREADY_LOADED)
            return
        }

        if (ChangesTrackerStore.getData() && Engine.loadedLevel) {
            WindowChangeStore.updateStore({
                message: LocalizationEN.UNSAVED_CHANGES, callback: async () => {
                    await this.save().catch(console.error)
                    this.loadLevel(levelID).catch(console.error)
                }
            })
            return
        }

        await EditorFSUtil.readRegistry()
        EntityNamingService.clear()
        EntitySelectionStore.updateStore({
            array: []
        })
        EntitySelectionStore.setLockedEntity(undefined)
        EditorActionHistory.clear()


        await Engine.loadLevel(levelID, false)
        const entities = Engine.entities.array
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.setPickID(PickingAPI.getPickerId(i + AXIS.ZY + 1))
        }
        if (Engine.loadedLevel)
            EntitySelectionStore.setLockedEntity(Engine.loadedLevel.id)
        EntityHierarchyService.updateHierarchy()
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
                viewMetadata.cameraMetadata = CameraAPI.serializeState()
                viewMetadata.cameraMetadata.prevX = CameraTracker.xRotation
                viewMetadata.cameraMetadata.prevY = CameraTracker.yRotation
            }

            await FileSystemUtil.writeFile(
                FileSystemUtil.path + FileSystemUtil.sep + FileTypes.PROJECT,
                JSON.stringify({
                    ...metadata,
                    settings,
                    layout: TabsStore.getData(),
                    visualSettings: VisualsStore.getData(),
                    level: Engine.loadedLevel?.id
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
        if (!Engine.loadedLevel)
            return
        const serialized = {
            entity: Engine.loadedLevel.serializable(),
            entities: QueryAPI.getHierarchy(Engine.loadedLevel).map(e => e.serializable()),
        }

        const assetReg = EditorFSUtil.getRegistryEntry(Engine.loadedLevel.id)
        let path = assetReg?.path

        if (!assetReg) {
            path = FileSystemUtil.resolvePath(await EditorUtil.resolveFileName(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + Engine.loadedLevel.name, FileTypes.LEVEL))
            await EditorFSUtil.createRegistryEntry(Engine.loadedLevel.id, FileSystemUtil.sep + path.split(FileSystemUtil.sep).pop())
            EditorFSUtil.readRegistry().catch(console.error)
        } else
            path = FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path

        await FileSystemUtil.write(
            path,
            serializeStructure(serialized)
        )
        ChangesTrackerStore.updateStore({changed: false})
    }
}



