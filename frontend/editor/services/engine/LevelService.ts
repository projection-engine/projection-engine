import FileSystemUtil from "../../../shared/FileSystemUtil"
import EditorActionHistory from "../EditorActionHistory"
import Engine from "../../../../engine-core/Engine"
import EditorFSUtil from "../../util/EditorFSUtil"
import EngineStore from "../../../stores/EngineStore"
import SelectionStore from "../../../stores/SelectionStore"
import SettingsStore from "../../../stores/SettingsStore"
import VisualsStore from "../../../stores/VisualsStore"
import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI"
import TabsStore from "../../../stores/TabsStore"
import CameraTracker from "../../../../engine-core/tools/lib/CameraTracker"
import serializeStructure from "../../../../engine-core/utils/serialize-structure"
import ElectronResources from "../../../shared/lib/ElectronResources"
import ErrorLoggerService from "../ErrorLoggerService"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import ChangesTrackerStore from "../../../stores/ChangesTrackerStore"
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI"
import EntityHierarchyService from "./EntityHierarchyService"
import EntityNamingService from "./EntityNamingService"
import PickingAPI from "../../../../engine-core/lib/utils/PickingAPI"
import AXIS from "../../../../engine-core/tools/static/AXIS"
import WindowChangeStore from "../../../stores/WindowChangeStore"
import IPCRoutes from "../../../../shared/IPCRoutes"
import LocalizationEN from "../../../../shared/LocalizationEN"
import FileTypes from "../../../../shared/FileTypes"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import EditorUtil from "../../util/EditorUtil"
import SelectionTargets from "../../../../shared/SelectionTargets"
import TabsStoreUtil from "../../util/TabsStoreUtil"
import SelectionStoreUtil from "../../util/SelectionStoreUtil"


export default class LevelService extends AbstractSingleton {
	#levelToLoad

	constructor(resolvePromise: Function) {
		super()
		ElectronResources.ipcRenderer.once(
			IPCRoutes.LOAD_PROJECT_METADATA,
			(_, meta) => this.#onLoad(resolvePromise, meta))
		ElectronResources.ipcRenderer.send(IPCRoutes.LOAD_PROJECT_METADATA)
	}

	#onLoad(resolvePromise, meta){
		if (!meta) {
			ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_LOADING_PROJECT)
			return
		}
		if (meta.settings !== undefined) {
			const newSettings = {...meta.settings}

			newSettings.visualSettings = undefined
			if (meta.layout)
				TabsStore.updateStore({layout: meta.layout})

			SettingsStore.updateStore(newSettings)
			if (meta.visualSettings)
				VisualsStore.updateStore( meta.visualSettings)
		}
		EngineStore.updateStore({
			meta: {...meta, settings: undefined, visualSettings: undefined, layout: undefined},
			isReady: true
		})

		this.#levelToLoad = meta.level
		resolvePromise()
	}

	static getInstance(): LevelService{
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
					await this.save().catch()
					this.loadLevel(levelID).catch()
				}
			})
			return
		}

		await EditorFSUtil.readRegistry()
		EntityNamingService.clear()
		SelectionStore.updateStore({
			TARGET: SelectionTargets.ENGINE,
			array: []
		})
		SelectionStoreUtil.setLockedEntity(undefined)
		EditorActionHistory.clear()


		await Engine.loadLevel(levelID, false)
		Engine.entities.array.forEach((entity, i) => {
			entity.setPickID(PickingAPI.getPickerId(i + AXIS.ZY + 1))
		})
		if (Engine.loadedLevel)
			SelectionStore.updateStore({
				TARGET: SelectionTargets.ENGINE,
				array: [Engine.loadedLevel.id],
				lockedEntity: Engine.loadedLevel.id
			})
		SelectionStoreUtil.setLockedEntity(Engine.loadedLevel.id)
		EntityHierarchyService.updateHierarchy()
	}

	async save() {
		if (!ChangesTrackerStore.getData().changed)
			return

		if (EngineStore.getData().executingAnimation) {
			ToastNotificationSystem.getInstance().warn(LocalizationEN.EXECUTING_SIMULATION)
			return
		}

		await ErrorLoggerService.save()
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

			await this.saveCurrentLevel().catch()
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
			EditorFSUtil.readRegistry().catch()
		} else
			path = FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + path

		await FileSystemUtil.write(
			path,
			serializeStructure(serialized)
		)
		ChangesTrackerStore.updateStore({changed: false})
	}
}



