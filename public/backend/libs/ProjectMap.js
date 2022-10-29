import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import {readRegistry} from "../utils/fs-operations";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const path = require("path")
export default class ProjectMap {
    static id
    static pathToProject
    static pathToAssets
    static pathToPreviews
    static pathToRegistry

    static registry = {}

    static async initialize(pathTo) {
        ProjectMap.pathToProject = pathTo

        ProjectMap.id = pathTo.split(path.sep).pop()
        ProjectMap.pathToRegistry = pathTo + path.sep + FILE_TYPES.REGISTRY
        ProjectMap.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        ProjectMap.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)
        ProjectMap.registry = await readTypedFile(ProjectMap.pathToRegistry, "json") || {}
    }
}