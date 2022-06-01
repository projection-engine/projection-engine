import {rm} from "../../events/FSEvents"
import {readRegistry} from "./FSOperations"
import PathSep from "../../PathSep"

const fs = require("fs")

export default async function cleanUpRegistry(projectPath) {
    const files = await readRegistry(projectPath)
    for (let i in files) {
        const f = files[i]
        if (!fs.existsSync(projectPath + PathSep.sep + "assets" +PathSep.sep +  f.path))
            await rm(f.registryPath)
    }
}
