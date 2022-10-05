import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../../shared/libs/FilesAPI";
import ErrorLoggerAPI from "../../shared/libs/ErrorLoggerAPI";
import WINDOW_FRAME_MENU from "../../static/WINDOW_FRAME_MENU";
import LevelController from "./LevelController";
import ActionHistoryAPI from "./ActionHistoryAPI";
import ViewportActions from "./ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import ROUTES from "../../static/ROUTES";

const {ipcRenderer, shell} = window.require("electron")
export default function InitializeWindow(openAbout) {
    ErrorLoggerAPI.initialize()
    FilesAPI.initializeFolders()
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat
    WINDOW_FRAME_MENU.forEach(e => {
        e.submenu.forEach(s => {
            if (s.id == null)
                return
            ipcRenderer.on(s.id, () => {
                switch (s.id) {
                    case "save":
                        LevelController.save().catch()
                        break
                    case "undo":
                        ActionHistoryAPI.undo()
                        break
                    case "redo":
                        ActionHistoryAPI.redo()
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
                        openAbout()
                        break
                    case "preferences":
                        const settingsClone = structuredClone(SettingsStore.data)
                        ipcRenderer.send(
                            ROUTES.OPEN_SETTINGS + sessionStorage.getItem("electronWindowID"),
                            settingsClone
                        )
                        break
                    case "reload":
                        window.location.reload()
                        break
                }
            })
        })
    })

}