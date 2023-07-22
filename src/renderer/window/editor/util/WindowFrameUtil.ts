import SettingsStore from "../../shared/stores/SettingsStore"
import LevelService from "../services/engine/LevelService"
import EditorActionHistory from "../services/EditorActionHistory"
import ViewportActionUtil from "../services/ViewportActionUtil"
import ElectronResources from "../../shared/lib/ElectronResources"
import GPU from "../../../engine/core/GPU"
import ResourceManager from "../../../engine/core/runtime/ResourceManager"
import WindowChangeStore from "../../shared/stores/WindowChangeStore"
import LocalizationEN from "../../../../shared/enums/LocalizationEN"
import IPCRoutes from "../../../../shared/enums/IPCRoutes"

export default class WindowFrameUtil {
	static #callMethod(id: string) {
		switch (id) {
		case "save":
			LevelService.getInstance().save().catch(console.error)
			break
		case "undo":
			EditorActionHistory.undo()
			break
		case "redo":
			EditorActionHistory.redo()
			break
		case "copy":
			ViewportActionUtil.copy()
			break
		case "paste":
			ViewportActionUtil.paste()
			break
		case "footer":
			SettingsStore.updateStore({hideFooter: !SettingsStore.getData().hideFooter})
			break
		case "learn-more":
			ElectronResources.shell.openExternal("https://github.com/projection-engine").catch(console.error)
			break

		case "fullscreen":
			GPU.canvas.requestFullscreen().catch(console.error)
			break
		case "reload":
			ElectronResources.ipcRenderer.send("reload")
		}
	}

	static getFrameOptions(disabledSave: boolean) {
		return [
			{divider: true, label: "File"},
			{
				label: "Save",
				icon: "save",
				disabled: disabledSave,
				onClick: () => WindowFrameUtil.#callMethod("save")
			},
			{
				label: "Clear unused resources",
				onClick: ResourceManager.execute
			},
			{divider: true, label: "Utils"},
			{
				label: "Toggle fullscreen",
				icon: "fullscreen",
				onClick: () => WindowFrameUtil.#callMethod("fullscreen")
			},
			{
				label: "Toggle footer",
				onClick: () => WindowFrameUtil.#callMethod("footer")
			},
			{divider: true, label: "Other"},
			{
				label: "Reload project",
				icon: "refresh",
				onClick: () => WindowChangeStore.updateStore({
					message: LocalizationEN.UNSAVED_CHANGES, callback: () => {
						LevelService.getInstance().save().then(() => WindowFrameUtil.#callMethod("reload"))
					}
				})
			},
			{
				label: "Close project",
				onClick: () => WindowChangeStore.updateStore({
					message: LocalizationEN.UNSAVED_CHANGES,
					callback: () => {
						LevelService.getInstance().save().then(() => ElectronResources.ipcRenderer.send(IPCRoutes.CLOSE_EDITOR))
					}
				})
			},
		]
	}

}