const fs = require("fs")
const path = require("path")

export default function writeOutput() {
    const log = console.log
    const error = console.error

    const PATH_TO = __dirname + path.sep + "CACHE.log"
    let CONTENT = ""
    try {
        fs.rmSync(PATH_TO)
    } catch (err) {
        error(err)
    }
    const newMethod = (...msg) => {
        log(msg)
        CONTENT += "\n\n" + JSON.stringify(msg)
        fs.writeFileSync(PATH_TO, CONTENT)
    }

    console.log = newMethod
    console.error = newMethod
}