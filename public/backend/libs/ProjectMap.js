import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import {readRegistry} from "../utils/fs-operations";

const path = require("path")
export default class ProjectMap {
    static id
    static pathToProject
    static pathToAssets
    static pathToPreviews
    static pathToRegistry

    static registry = []

    static async initialize(pathTo) {
        ProjectMap.pathToProject = pathTo

        ProjectMap.id = pathTo.split(path.sep).pop()
        ProjectMap.pathToRegistry = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY)
        ProjectMap.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        ProjectMap.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)
        ProjectMap.registry = await readRegistry(ProjectMap.pathToRegistry)

    }
}