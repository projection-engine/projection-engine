import fileSystem from "./file-system"
import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";
import ProjectController from "../libs/ProjectController";

const {BrowserWindow, app, ipcMain, webContents, dialog, Menu, } = require("electron")
const isDev = require("electron-is-dev")
const os = require("os")
const path = require("path");
export default async function createEnv():Promise<void> {


    let pathToProject:string|undefined
    if (isDev)
        pathToProject = os.homedir() + path.sep + "SAMPLE" + path.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION
    else
        pathToProject = <string|undefined>process.env.PROJECT_TO_OPEN

    if (!pathToProject) {
        app.quit()
        return
    }

    await ProjectController.initialize()
    const basePath = pathToProject.replace(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "")
    await ProjectController.prepareForUse(basePath)
}