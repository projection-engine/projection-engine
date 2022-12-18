import fileSystem from "./file-system"
import window from "../libs/Window";
import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";

const {app} = require("electron");
const isDev = require("electron-is-dev")
const os = require("os")
const path = require("path");
export default async function createEnv():Promise<void> {
    fileSystem()

    let pathToProject:string|undefined
    if (isDev)
        pathToProject = os.homedir() + path.sep + "SAMPLE" + path.sep + PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION
    else
        pathToProject = <string|undefined>process.env.PROJECT_TO_OPEN

    if (!pathToProject) {
        app.quit()
        return
    }

    const result = await window(pathToProject, isDev)
    if (!result)
        app.quit()
}