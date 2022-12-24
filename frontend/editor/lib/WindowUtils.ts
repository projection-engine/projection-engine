import LevelController from "./utils/LevelController";
import UndoRedoAPI from "./utils/UndoRedoAPI";
import ViewportActions from "./utils/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import GPU from "../../../engine-core/GPU";

const {ipcRenderer, shell} = window.require("electron")
export default class WindowUtils {
    static openAbout?:Function
    static callMethod(id:string) {
        switch (id) {
            case "save":
                LevelController.save().catch()
                break
            case "undo":
                UndoRedoAPI.undo()
                break
            case "redo":
                UndoRedoAPI.redo()
                break
            case "copy":
                ViewportActions.copy()
                break
            case "paste":
                ViewportActions.paste()
                break
            case "footer":
                SettingsStore.updateStore({...SettingsStore.data, hideFooter: !SettingsStore.data.hideFooter})
                break
            case "learn-more":
                shell.openExternal("https://github.com/projection-engine").catch()
                break
            case "about":
                WindowUtils.openAbout?.()
                break
            case "fullscreen":
               GPU.canvas.requestFullscreen().catch()
                break
            case "reload":
                ipcRenderer.send("reload")
        }
    }

}