
const {readFile} = require( "../../file-system/fs-essentials")
const pathRequire = require("path")
module.exports =  async function loadMetadata(projectPath) {
    let settings, meta
    try {
        let res = (await readFile(projectPath + pathRequire.sep + ".settings"))[1]
        settings = {type: "settings", data: res ? JSON.parse(res) : {}}
        res = (await readFile(projectPath + pathRequire.sep + ".meta"))[1]
        meta = {type: "meta", data: res ? JSON.parse(res) : {}}

        return {settings, meta}
    } catch (e) {
        console.log(e)
        return {}
    }
}
