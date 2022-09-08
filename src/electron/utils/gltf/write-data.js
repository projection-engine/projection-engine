const fs = require("fs")
const path = require("path")
const REG_PATH = require("../../../data/REG_PATH")
const FILE_TYPES = require("../../../data/FILE_TYPES")
const PREVIEW_PATH = require("../../../data/PREVIEW_PATH")

module.exports = async function writeData(pathName, data, regID, projectPath, preview) {
    return new Promise(resolve => {
        fs.writeFile(
            pathName,
            typeof data === "string" ? data : JSON.stringify(data),
            () => {
                fs.writeFile(
                    projectPath + path.sep + REG_PATH + path.sep + regID + FILE_TYPES.REGISTRY,
                    JSON.stringify({
                        path: path.resolve(pathName).replace(path.resolve(projectPath + path.sep + "assets") + path.sep, ""),
                        id: regID
                    }),
                    () => {
                        if (preview)
                            fs.writeFile(
                                projectPath + path.sep + PREVIEW_PATH + path.sep + regID + FILE_TYPES.PREVIEW,
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