import LevelService from "../../../services/engine/LevelService"

import EngineResourceLoaderService from "../../../services/engine/EngineResourceLoaderService"
import openBottomView from "../../../utils/open-bottom-view"
import VIEWS from "../../../components/view/static/VIEWS"
import ShaderEditorTools from "../../shader-editor/libs/ShaderEditorTools"
import FileSystemService from "../../../../shared/lib/FileSystemService"
import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem"
import ElectronResources from "../../../../shared/lib/ElectronResources"
import FileTypes from "../../../../../shared/FileTypes";
import LocalizationEN from "../../../../../shared/LocalizationEN";

export default function openItem(data, setCurrentDirectory, setSelected, reset, type) {
	if (!data)
		return
	if (type === 1) {
		const fileType = "." + data.type
		ToastNotificationSystem.getInstance().warn(LocalizationEN.OPENING_ASSET+  " (" + data.name + ")")
		switch (fileType) {
		case FileTypes.UI_LAYOUT:
		case FileTypes.COMPONENT:
		case ".js":
		case ".json":
			ElectronResources.shell.openPath(FileSystemService.getInstance().resolvePath(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + data.id))
				.catch(err => {
					ToastNotificationSystem.getInstance().error(LocalizationEN.ERROR_OPENING_FILE)
					console.error(err)
				})
			break
		case FileTypes.PRIMITIVE:
		case FileTypes.COLLECTION:
		case FileTypes.TEXTURE:
			EngineResourceLoaderService.load(data.registryID, true).catch()
			ToastNotificationSystem.getInstance().warn(LocalizationEN.CREATING_ENTITY)
			break
		case FileTypes.LEVEL:
			LevelService.getInstance().loadLevel(data.registryID).catch()
			break
		case FileTypes.MATERIAL:
			ShaderEditorTools.toOpenFile = data
			openBottomView(VIEWS.SHADER_EDITOR)
			break
		default:
			setSelected(data.id)
			break
		}
	} else {
		reset()
		setCurrentDirectory(data)
	}
}