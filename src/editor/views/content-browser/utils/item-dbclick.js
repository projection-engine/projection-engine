import FILE_TYPES from "../../../../static/FILE_TYPES";
import FilesStore from "../../../stores/FilesStore";
import FilesAPI from "../../../../shared/libs/FilesAPI";
import LevelController from "../../../libs/LevelController";

const {shell} = window.require("electron")

export default function itemDbclick(data, setCurrentDirectory, setSelected, reset, type) {
    if (type === 1) {
        const fileType = "." + data.type
        if (fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT) {
            shell.openPath(FilesStore.ASSETS_PATH + FilesAPI.sep + data.id).catch()
            alert.pushAlert(translate("OPENING_FILE") + " (" + data.name + ")", "info")
        } else if (fileType === FILE_TYPES.LEVEL) {
            alert.pushAlert(translate("OPENING_LEVEL") + " (" + data.name + ")", "info")
            LevelController.loadLevel(data).catch()
        } else
            setSelected(data.id)
    } else {
        reset()
        setCurrentDirectory(data)
    }
}