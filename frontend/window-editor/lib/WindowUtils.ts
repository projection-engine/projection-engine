import LevelController from "./utils/LevelController";
import EditorActionHistory from "./utils/EditorActionHistory";
import ViewportActions from "./utils/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import GPU from "../../../engine-core/GPU";
import Electron from "../../shared/lib/Electron";


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
                Electron.shell.openExternal("https://github.com/projection-engine").catch()
                break

            case "fullscreen":
               GPU.canvas.requestFullscreen().catch()
                break
            case "reload":
                Electron.ipcRenderer.send("reload")
        }
    }

}