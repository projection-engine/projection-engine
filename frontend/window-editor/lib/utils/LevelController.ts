import FilesAPI from "../fs/FilesAPI"
import EditorActionHistory from "./EditorActionHistory"
import Engine from "../../../../engine-core/Engine"
import RegistryAPI from "../fs/RegistryAPI"
import EngineStore from "../../../shared/stores/EngineStore"
import SelectionStore from "../../../shared/stores/SelectionStore"
import SettingsStore from "../../../shared/stores/SettingsStore"
import VisualsStore from "../../../shared/stores/VisualsStore"
import SETTINGS from "../../static/SETTINGS"

import CameraAPI from "../../../../engine-core/lib/utils/CameraAPI"
import TabsStore from "../../../shared/stores/TabsStore"
import CameraTracker from "../../../../engine-core/tools/lib/CameraTracker"
import serializeStructure from "../../../../engine-core/utils/serialize-structure"
import FS from "../../../shared/lib/FS/FS"

import ElectronResources from "../../../shared/lib/ElectronResources"
import ErrorLoggerAPI from "../fs/ErrorLoggerAPI"
import AlertController from "../../../shared/components/alert/AlertController"
import ChangesTrackerStore from "../../../shared/stores/ChangesTrackerStore"
import QueryAPI from "../../../../engine-core/lib/utils/QueryAPI"
import HierarchyController from "../controllers/HierarchyController"
import resolveFileName from "../../utils/resolve-file-name"
import NameController from "../controllers/NameController"
import PickingAPI from "../../../../engine-core/lib/utils/PickingAPI"
import AXIS from "../../../../engine-core/tools/static/AXIS"
import WindowChangeStore from "../../../shared/components/frame/WindowChangeStore"
import IPCRoutes from "../../../../contants/IPCRoutes";
import LocalizationEN from "../../../../contants/LocalizationEN";
import FileTypes from "../../../../contants/FileTypes";


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
				IPCRoutes.LOAD_PROJECT_METADATA,
				(ev, meta) => {
					if (!meta) {
						AlertController.error(LocalizationEN.ERROR_LOADING_PROJECT)
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
			ElectronResources.ipcRenderer.send(IPCRoutes.LOAD_PROJECT_METADATA)
		})
	}

	static async loadLevel(levelID?: string) {
		if (!levelID || levelID && levelID === Engine.loadedLevel?.id) {
			if (levelID && levelID === Engine.loadedLevel?.id)
				AlertController.error(LocalizationEN.LEVEL_ALREADY_LOADED)
			return
		}

		if (ChangesTrackerStore.data && Engine.loadedLevel) {
			WindowChangeStore.updateStore({
				message: LocalizationEN.UNSAVED_CHANGES, callback: async () => {
					await LevelController.save().catch()
					LevelController.loadLevel(levelID).catch()
				}
			})
			return
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

		HierarchyController.updateHierarchy()
	}

	static async save() {
		if (!ChangesTrackerStore.data)
			return

		if (EngineStore.engine.executingAnimation) {
			AlertController.warn(LocalizationEN.EXECUTING_SIMULATION)
			return
		}

		await ErrorLoggerAPI.save()
		AlertController.warn(LocalizationEN.SAVING)
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
				FS.path + FS.sep + FileTypes.PROJECT,
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
		AlertController.success(LocalizationEN.PROJECT_SAVED)
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
			path = FS.resolvePath(await resolveFileName(FS.ASSETS_PATH + FS.sep + Engine.loadedLevel.name, FileTypes.LEVEL))
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



