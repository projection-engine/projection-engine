import WindowChangeStore from "../../../../shared/components/frame/WindowChangeStore"

import ElectronResources from "../../../../shared/lib/ElectronResources"
import LevelService from "../../../services/engine/LevelService"
import EditorActionHistory from "../../../services/EditorActionHistory"
import ViewportActionService from "../../../services/ViewportActionService"
import SettingsStore from "../../../../shared/stores/SettingsStore"
import GPU from "../../../../../engine-core/GPU"
import ResourceManager from "../../../../../engine-core/runtime/ResourceManager"
import LocalizationEN from "../../../../../shared/LocalizationEN";
import IPCRoutes from "../../../../../shared/IPCRoutes";

function callMethod(id: string) {
	switch (id) {
	case "save":
		LevelService.save().catch()
		break
	case "undo":
		EditorActionHistory.undo()
		break
	case "redo":
		EditorActionHistory.redo()
		break
	case "copy":
		ViewportActionService.copy()
		break
	case "paste":
		ViewportActionService.paste()
		break
	case "footer":
		SettingsStore.updateStore({...SettingsStore.data, hideFooter: !SettingsStore.data.hideFooter})
		break
	case "learn-more":
		ElectronResources.shell.openExternal("https://github.com/projection-engine").catch()
		break

	case "fullscreen":
		GPU.canvas.requestFullscreen().catch()
		break
	case "reload":
		ElectronResources.ipcRenderer.send("reload")
	}
}

export default function getFrameOptions(disabledSave: boolean) {
	return [
		{divider: true, label: "File"},
		{
			label: "Save",
			icon: "save",
			disabled: disabledSave,
			onClick: () => callMethod("save")
		},
		{
			label: "Clear unused resources",
			onClick: ResourceManager.execute
		},
		{divider: true, label: "Utils"},
		{
			label: "Toggle fullscreen",
			icon: "fullscreen",
			onClick: () => callMethod("fullscreen")
		},
		{
			label: "Toggle footer",
			onClick: () => callMethod("footer")
		},
		{divider: true, label: "Other"},
		{
			label: "Reload project",
			icon: "refresh",
			onClick: () => WindowChangeStore.updateStore({
				message: LocalizationEN.UNSAVED_CHANGES, callback: () => {
					LevelService.save().then(() => callMethod("reload"))
				}
			})
		},
		{
			label: "Close project",
			onClick: () => WindowChangeStore.updateStore({
				message: LocalizationEN.UNSAVED_CHANGES,
				callback: () => {
					LevelService.save().then(() => ElectronResources.ipcRenderer.send(IPCRoutes.CLOSE_EDITOR))
				}
			})
		},
	]
}