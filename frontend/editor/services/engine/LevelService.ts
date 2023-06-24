import FSFilesService from "../file-system/FSFilesService"
import EditorActionHistory from "../EditorActionHistory"
import Engine from "../../../../engine-core/Engine"
import FSRegistryService from "../file-system/FSRegistryService"
import EngineStore from "../../../shared/stores/EngineStore"
import SelectionStore from "../../../shared/stores/SelectionStore"
import SettingsStore from "../../../shared/stores/SettingsStore"
import VisualsStore from "../../../shared/stores/VisualsStore"
import SETTINGS from "../../static/SETTINGS"

import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI"
import TabsStore from "../../../shared/stores/TabsStore"
import CameraTracker from "../../../../engine-core/tools/lib/CameraTracker"
import serializeStructure from "../../../../engine-core/utils/serialize-structure"
import FileSystemService from "../../../shared/lib/FileSystemService"

import ElectronResources from "../../../shared/lib/ElectronResources"
import ErrorLoggerService from "../file-system/ErrorLoggerService"
import ToastNotificationSystem from "../../../shared/components/alert/ToastNotificationSystem"
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore"
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI"
import EntityHierarchyService from "./EntityHierarchyService"
import EntityNamingService from "./EntityNamingService"
import PickingAPI from "../../../../engine-core/lib/utils/PickingAPI"
import AXIS from "../../../../engine-core/tools/static/AXIS"
import WindowChangeStore from "../../../shared/stores/WindowChangeStore"
import IPCRoutes from "../../../../shared/IPCRoutes"
import LocalizationEN from "../../../../shared/LocalizationEN"
import FileTypes from "../../../../shared/FileTypes"
import AbstractSingleton from "../../../../shared/AbstractSingleton"
import EditorUtil from "../../util/EditorUtil"


export default class LevelService extends AbstractSingleton {
	#levelToLoad

	constructor(resolvePromise: Function) {
		super()
		ElectronResources.ipcRenderer.once(
			IPCRoutes.LOAD_PROJECT_METADATA,
			(ev, meta) => {
				if (!meta) {
					ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_LOADING_PROJECT)
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
					meta: {...meta, settings: undefined, visualSettings: undefined, layout: undefined}, isReady: true
				})

				this.#levelToLoad = meta.level
				resolvePromise()
			})
		ElectronResources.ipcRenderer.send(IPCRoutes.LOAD_PROJECT_METADATA)
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

		if (ChangesTrackerStore.data && Engine.loadedLevel) {
			WindowChangeStore.updateStore({
				message: LocalizationEN.UNSAVED_CHANGES, callback: async () => {
					await this.save().catch()
					this.loadLevel(levelID).catch()
				}
			})
			return
		}

		await FSRegistryService.readRegistry()
		EntityNamingService.clear()
		SelectionStore.updateStore({
			...SelectionStore.data,
			TARGET: SelectionStore.TYPES.ENGINE,
			array: [],
			lockedEntity: undefined
		})
		EditorActionHistory.clear()


		await Engine.loadLevel(levelID, false)
		Engine.entities.array.forEach((entity, i) => {
			entity.setPickID(PickingAPI.getPickerId(i + AXIS.ZY + 1))
		})
		if (Engine.loadedLevel)
			SelectionStore.updateStore({
				...SelectionStore.data,
				TARGET: SelectionStore.TYPES.ENGINE,
				array: [Engine.loadedLevel.id],
				lockedEntity: Engine.loadedLevel.id
			})

		EntityHierarchyService.updateHierarchy()
	}

	async save() {
		if (!ChangesTrackerStore.data)
			return

		if (EngineStore.engine.executingAnimation) {
			ToastNotificationSystem.getInstance().warn(LocalizationEN.EXECUTING_SIMULATION)
			return
		}

		await ErrorLoggerService.save()
		ToastNotificationSystem.getInstance().warn(LocalizationEN.SAVING)
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

			await FSFilesService.writeFile(
				FileSystemService.getInstance().path + FileSystemService.getInstance().sep + FileTypes.PROJECT,
				JSON.stringify({
					...metadata,
					settings,
					layout: TabsStore.data,
					visualSettings: VisualsStore.data,
					level: Engine.loadedLevel?.id
				}), true)

			await this.saveCurrentLevel().catch()
		} catch (err) {
			console.error(err)
			return
		}
		ToastNotificationSystem.getInstance().success(LocalizationEN.PROJECT_SAVED)
		await FSRegistryService.readRegistry()
	}

	async saveCurrentLevel() {
		if (!Engine.loadedLevel)
			return
		const serialized = {
			entity: Engine.loadedLevel.serializable(),
			entities: QueryAPI.getHierarchy(Engine.loadedLevel).map(e => e.serializable()),
		}

		const assetReg = FSRegistryService.getRegistryEntry(Engine.loadedLevel.id)
		let path = assetReg?.path

		if (!assetReg) {
			path = FileSystemService.getInstance().resolvePath(await EditorUtil.resolveFileName(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + Engine.loadedLevel.name, FileTypes.LEVEL))
			await FSRegistryService.createRegistryEntry(Engine.loadedLevel.id, FileSystemService.getInstance().sep + path.split(FileSystemService.getInstance().sep).pop())
			FSRegistryService.readRegistry().catch()
		} else
			path = FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + path

		await FileSystemService.getInstance().write(
			path,
			serializeStructure(serialized)
		)
		ChangesTrackerStore.updateStore(false)
	}
}



