import FILE_TYPES from "shared-resources/FILE_TYPES";
import PROJECT_FOLDER_STRUCTURE from "../../../../src/static/PROJECT_FOLDER_STRUCTURE";
const fs = require("fs")
const path = require("path")

export default async function writeData(pathName, data, regID, projectPath, preview) {
    return new Promise(resolve => {
        fs.writeFile(
            pathName,
            typeof data === "string" ? data : JSON.stringify(data),
            () => {
                fs.writeFile(
                    projectPath + path.sep + PROJECT_FOLDER_STRUCTURE.REGISTRY + path.sep + regID + FILE_TYPES.REGISTRY,
                    JSON.stringify({
                        path: path.resolve(pathName).replace(path.resolve(projectPath + path.sep + PROJECT_FOLDER_STRUCTURE.ASSETS) + path.sep, ""),
                        id: regID
                    }),
                    () => {
                        if (preview)
                            fs.writeFile(
                                projectPath + path.sep + PROJECT_FOLDER_STRUCTURE.PREVIEWS + path.sep + regID + FILE_TYPES.PREVIEW,
                                preview,
                                () => resolve()
                            )
                        else
                            resolve()
                    }
                )
            }
        )
    })
}