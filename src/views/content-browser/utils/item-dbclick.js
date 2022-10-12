import FILE_TYPES from "shared-resources/FILE_TYPES";
import LevelController from "../../../libs/LevelController";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import Localization from "../../../libs/libs/Localization";

const {shell} = window.require("electron")


export default function itemDbclick(data, setCurrentDirectory, setSelected, reset, type) {
    if (type === 1) {
        const fileType = "." + data.type
        if (fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT) {
            shell.openPath(NodeFS.ASSETS_PATH  + NodeFS.sep + data.id).catch()
            alert.pushAlert(Localization.PROJECT.FILES.OPENING_FILE + " (" + data.name + ")", "info")
        } else if (fileType === FILE_TYPES.LEVEL) {
            alert.pushAlert(Localization.PROJECT.FILES.OPENING_LEVEL + " (" + data.name + ")", "info")
            LevelController.loadLevel(data).catch()
        } else
            setSelected(data.id)
    } else {
        reset()
        setCurrentDirectory(data)
    }
}