import assimpJs from "./assimp-js";
import readTypedFile from "../read-typed-file";

const fs = require("fs")
const pathRequire = require("path")
export default async function assimpLoader(pathToDir, files) {
    const dir = pathRequire.resolve(pathToDir)
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir)

    for (let j = 0; j < files.length; j++) {
        const buffer = await fs.promises.readFile(files[j])
        await assimpJs(dir, files[j], buffer)
    }
}
