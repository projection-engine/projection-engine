import LevelController from "./utils/LevelController";
import EditorActionHistory from "./utils/EditorActionHistory";
import ViewportActions from "./utils/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import GPU from "../../../../engine-core/GPU";

const {ipcRenderer, shell} = window.require("electron")
export default class WindowUtils {
    static callMethod(id:string) {
        switch (id) {
            case "save":
                LevelController.save().catch()
                break
            case "undo":
                EditorActionHistory.undo()
                break
            case "redo":
                EditorActionHistory.redo()
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

            case "fullscreen":
               GPU.canvas.requestFullscreen().catch()
                break
            case "reload":
                ipcRenderer.send("reload")
        }
    }

}