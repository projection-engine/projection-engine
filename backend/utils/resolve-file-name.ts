import WindowController from "../libs/WindowController";
import * as fs from "fs";
import * as pathRequire from "path";

export default function resolveFileName(path, ext) {
    let n = path + ext
    let it = 0
    while (fs.existsSync(WindowController.pathToAssets + pathRequire.sep + n)) {
        n = path + `-${it}` + ext
        it++
    }
    return n
}