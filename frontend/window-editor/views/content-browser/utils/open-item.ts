import LevelController from "../../../lib/utils/LevelController";
import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
import Loader from "../../../lib/parsers/Loader";
import openBottomView from "../../../utils/open-bottom-view";
import VIEWS from "../../../components/view/static/VIEWS";
import ShaderEditorTools from "../../shader-editor/libs/ShaderEditorTools";
import FILE_TYPES from "../../../../../static/objects/FILE_TYPES";
import FS from "../../../../shared/lib/FS/FS";
import AlertController from "../../../../shared/components/alert/AlertController";
import ElectronResources from "../../../../shared/lib/ElectronResources";

export default function openItem(data, setCurrentDirectory, setSelected, reset, type) {
    if(!data)
        return
    if (type === 1) {
        const fileType = "." + data.type
        switch (fileType) {
            case FILE_TYPES.UI_LAYOUT:
            case FILE_TYPES.COMPONENT:
            case ".js":
            case ".json":
                ElectronResources.shell.openPath(FS.resolvePath(FS.ASSETS_PATH + FS.sep + data.id))
                    .catch(err => {
                        AlertController.error(LOCALIZATION_EN.ERROR_OPENING_FILE)
                    console.error(err)
                })
                AlertController.warn(LOCALIZATION_EN.OPENING_FILE + " (" + data.name + ")")
                break
            case FILE_TYPES.PRIMITIVE:
            case FILE_TYPES.COLLECTION:
            case FILE_TYPES.TEXTURE:
            case FILE_TYPES.TERRAIN:
                Loader.load(data.registryID, true).catch()
                AlertController.warn(LOCALIZATION_EN.CREATING_ENTITY)
                break
            case FILE_TYPES.LEVEL:
                AlertController.warn(LOCALIZATION_EN.OPENING_LEVEL + " (" + data.name + ")")
                LevelController.loadLevel(data).catch()
                break
            case FILE_TYPES.MATERIAL:
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