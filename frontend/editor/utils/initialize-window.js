import {mat3, mat4, quat, vec3, vec4} from "gl-matrix"
import FilesAPI from "../lib/fs/FilesAPI";
import LevelController from "../lib/utils/LevelController";
import UndoRedoAPI from "../lib/utils/UndoRedoAPI";
import ViewportActions from "../lib/utils/ViewportActions";
import SettingsStore from "../stores/SettingsStore";
import ROUTES from "../../../backend/static/ROUTES.ts";
import VisualsStore from "../stores/VisualsStore";
import NodeFS from "frontend/shared/libs/NodeFS";

const {ipcRenderer, shell} = window.require("electron")
export default function InitializeWindow(openAbout) {

    NodeFS.initializePaths()
    FilesAPI.initializeFolders().catch()
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
                openAbout()
                break
            case "fullscreen":
               window.GPUCanvas.requestFullscreen().catch()
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