import LevelService from "../../../services/engine/LevelService"

import EngineResourceLoaderService from "../../../services/engine/EngineResourceLoaderService"
import openBottomView from "../../../utils/open-bottom-view"
import VIEWS from "../../../components/view/static/VIEWS"
import ShaderEditorTools from "../../shader-editor/libs/ShaderEditorTools"
import FileSystemUtil from "../../../../shared/lib/FileSystemUtil"
import AlertController from "../../../../shared/components/alert/AlertController"
import ElectronResources from "../../../../shared/lib/ElectronResources"
import FileTypes from "../../../../../shared/FileTypes";
import LocalizationEN from "../../../../../shared/LocalizationEN";

export default function openItem(data, setCurrentDirectory, setSelected, reset, type) {
	if (!data)
		return
	if (type === 1) {
		const fileType = "." + data.type
		AlertController.warn(LocalizationEN.OPENING_ASSET+  " (" + data.name + ")")
		switch (fileType) {
		case FileTypes.UI_LAYOUT:
		case FileTypes.COMPONENT:
		case ".js":
		case ".json":
			ElectronResources.shell.openPath(FileSystemUtil.resolvePath(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + data.id))
				.catch(err => {
					AlertController.error(LocalizationEN.ERROR_OPENING_FILE)
					console.error(err)
				})
			break
		case FileTypes.PRIMITIVE:
		case FileTypes.COLLECTION:
		case FileTypes.TEXTURE:
			EngineResourceLoaderService.load(data.registryID, true).catch()
			AlertController.warn(LocalizationEN.CREATING_ENTITY)
			break
		case FileTypes.LEVEL:
			LevelService.loadLevel(data.registryID).catch()
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