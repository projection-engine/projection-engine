import PROJECT_FOLDER_STRUCTURE from "shared-resources/PROJECT_FOLDER_STRUCTURE";
import readTypedFile from "./utils/read-typed-file";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import PROJECT_PATH from "shared-resources/PROJECT_PATH";
import PROJECT_FILE_EXTENSION from "shared-resources/PROJECT_FILE_EXTENSION";

const path = require("path")
const fs = require("fs")

export default class ProjectController {
    static id
    static pathToProject
    static pathToAssets
    static pathToPreviews
    static pathToRegistry

    static registry = {}
    static window
    static metadata
    static #initialized

    static async prepareForUse(pathTo) {
        if (!ProjectController.#initialized) {
            ProjectController.#initialized = true
            const log = console.error
            console.error = (...msg) => {
                log(...msg)
                ProjectController.window.webContents.send("console", msg)
            }
            await ProjectController.window.loadFile(path.join(__dirname, '../../public/index.html'))
        }

        await ProjectController.window.webContents.executeJavaScript(`sessionStorage.setItem("${PROJECT_PATH}", "${pathTo.replaceAll("\\", "\\\\")}"); `)
        ProjectController.pathToProject = pathTo
        ProjectController.metadata = await readTypedFile(pathTo + path.sep + PROJECT_FILE_EXTENSION, "json")
        ProjectController.id = pathTo.split(path.sep).pop()
        ProjectController.pathToRegistry = pathTo + path.sep + FILE_TYPES.REGISTRY
        ProjectController.pathToAssets = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
        ProjectController.pathToPreviews = path.resolve(pathTo + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS)
        const temp = await readTypedFile(ProjectController.pathToRegistry, "json") || {}
        Object.entries(temp).forEach(([key, value]) => {
            const exists = fs.existsSync(path.resolve(ProjectController.pathToAssets + path.sep + value.path))
            if (!exists)
                delete temp[key]
        })
        ProjectController.registry = temp
    }
}