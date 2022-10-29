import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../libs/FilesAPI";
import ErrorLoggerAPI from "../libs/ErrorLoggerAPI";
import LevelController from "../libs/LevelController";
import ActionHistoryAPI from "../libs/ActionHistoryAPI";
import ViewportActions from "../libs/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import ROUTES from "../data/ROUTES";
import VisualsStore from "../stores/VisualsStore";
import NodeFS from "shared-resources/frontend/libs/NodeFS";

const {ipcRenderer, shell} = window.require("electron")
export default function InitializeWindow(openAbout) {

    NodeFS.initializePaths()
    ErrorLoggerAPI.initialize()
    FilesAPI.initializeFolders()
    Math.mat4 = mat4
    Math.mat3 = mat3
    Math.vec4 = vec4
    Math.vec3 = vec3
    Math.quat = quat


    window.frameOptionsCallback = (id) => {
        switch (id) {
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
            case "fullscreen":
               window.gpu.canvas.requestFullscreen().catch()
                break

            case "preferences":
                const settingsClone = structuredClone({...SettingsStore.data, ...VisualsStore.data})
                ipcRenderer.send(
                    ROUTES.OPEN_SETTINGS,
                    settingsClone
                )
                break
            case "reload":
                ipcRenderer.send("reload")
        }
    }

}