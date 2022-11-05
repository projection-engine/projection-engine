import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import readTypedFile from "../utils/read-typed-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";

const path = require("path")
const fs = require("fs")

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
        const temp  = await readTypedFile(ProjectMap.pathToRegistry, "json") || {}
        Object.entries(temp).forEach(([key, value]) => {
            const exists = fs.existsSync(path.resolve(ProjectMap.pathToAssets + path.sep + value.path))
            if(!exists)
                delete temp[key]
        })
        ProjectMap.registry = temp
    }
}