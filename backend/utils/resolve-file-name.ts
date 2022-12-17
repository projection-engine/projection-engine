import ProjectController from "../libs/ProjectController";

const fs = require("fs")
const pathRequire = require("path")

export default function resolveFileName(path, ext) {
    let n = path + ext
    let it = 0
    while (fs.existsSync(ProjectController.pathToAssets + pathRequire.sep + n)) {
        n = path + `-${it}` + ext
        it++
    }
    return n
}