import contextMenuController from "shared-resources/backend/context-menu-controller";
import ProjectController from "./ProjectController";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";
import AssimpLoader from "./assimp/AssimpLoader";
import Events from "./Events";

export default async function window(pathToProject:string, isDev:boolean):Promise<boolean> {
    try {
        await AssimpLoader.initialize()
        const basePath = pathToProject.replace(PROJECT_FILE_EXTENSION, "")
        await ProjectController.prepareForUse(basePath)
        Events.initializeListeners(isDev)
        contextMenuController(ProjectController.window, ProjectController.metadata.id)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}


