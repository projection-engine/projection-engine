import FILE_TYPES from "shared-resources/FILE_TYPES";
import LevelController from "../../../lib/utils/LevelController";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import Localization from "../../../templates/LOCALIZATION_EN";
import Loader from "../../../lib/parsers/Loader";
import openBottomView from "../../../utils/open-bottom-view";
import VIEWS from "../../../components/view/static/VIEWS";
import ShaderEditorController from "../../shader-editor/ShaderEditorController";

const {shell} = window.require("electron")


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
                shell.openPath(NodeFS.ASSETS_PATH + NodeFS.sep + data.id).catch()
                alert.pushAlert(Localization.OPENING_FILE + " (" + data.name + ")", "info")
                break
            case FILE_TYPES.PRIMITIVE:
            case FILE_TYPES.COLLECTION:
            case FILE_TYPES.TEXTURE:
            case FILE_TYPES.TERRAIN:
                Loader.load(data.registryID, true).catch()
                alert.pushAlert(Localization.CREATING_ENTITY, "info")
                break
            case FILE_TYPES.LEVEL:
                alert.pushAlert(Localization.OPENING_LEVEL + " (" + data.name + ")", "info")
                LevelController.loadLevel(data).catch()
                break
            case FILE_TYPES.MATERIAL:
                openBottomView(VIEWS.BLUEPRINT)
                ShaderEditorController.toOpenFile = data
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