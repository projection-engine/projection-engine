import contextMenuController from "../utils/context-menu-controller";
import ProjectController from "./ProjectController";

import AssimpLoader from "./assimp/AssimpLoader";
import Events from "./Events";
import PROJECT_STATIC_DATA from "../../static/objects/PROJECT_STATIC_DATA";

export default async function window(pathToProject:string, isDev:boolean):Promise<boolean> {
    try {
        await AssimpLoader.initialize()
        const basePath = pathToProject.replace(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION, "")
        await ProjectController.prepareForUse(basePath)
        Events.initializeListeners(isDev)
        contextMenuController(ProjectController.window)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}


