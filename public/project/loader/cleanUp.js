import {rm} from "../../events/FSEvents";
import {readRegistry} from "./FSOperations";

const pathRequire = require('path')
const fs = require('fs')

export default async function cleanUpRegistry(projectPath) {
    const files = await readRegistry(projectPath)
    for (let i in files) {
        const f = files[i]
        if (!fs.existsSync(projectPath + '\\assets\\' + f.path))
            await rm(f.registryPath)
    }
}
