import fileSystem from "shared-resources/backend/file-system"
import window from "./libs/Window";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import {app, BrowserWindow} from 'electron';
import isDev from 'electron-is-dev'
import * as os from "os";
import path from "path";

export default async function createEnv():Promise<void> {
    fileSystem()

    let pathToProject:string|undefined
    if (isDev)
        pathToProject = os.homedir() + path.sep + "SAMPLE" + path.sep + PROJECT_FILE_EXTENSION
    else
        pathToProject = <string|undefined>process.env.PROJECT_TO_OPEN

    if (!pathToProject)
        app.quit()

    const result = await window(pathToProject, isDev)
    if (!result)
        app.quit()
}