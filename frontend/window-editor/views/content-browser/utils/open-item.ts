import LevelController from "../../../lib/utils/LevelController"

import Loader from "../../../lib/parsers/Loader"
import openBottomView from "../../../utils/open-bottom-view"
import VIEWS from "../../../components/view/static/VIEWS"
import ShaderEditorTools from "../../shader-editor/libs/ShaderEditorTools"
import FS from "../../../../shared/lib/FS/FS"
import AlertController from "../../../../shared/components/alert/AlertController"
import ElectronResources from "../../../../shared/lib/ElectronResources"
import FileTypes from "../../../../../contants/FileTypes";
import LocalizationEN from "../../../../../contants/LocalizationEN";

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
			ElectronResources.shell.openPath(FS.resolvePath(FS.ASSETS_PATH + FS.sep + data.id))
				.catch(err => {
					AlertController.error(LocalizationEN.ERROR_OPENING_FILE)
					console.error(err)
				})
			break
		case FileTypes.PRIMITIVE:
		case FileTypes.COLLECTION:
		case FileTypes.TEXTURE:
			Loader.load(data.registryID, true).catch()
			AlertController.warn(LocalizationEN.CREATING_ENTITY)
			break
		case FileTypes.LEVEL:
			LevelController.loadLevel(data.registryID).catch()
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