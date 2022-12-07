const fs = require("fs")
const pathRequire = require("path")
export default async function readTypedFile(pathName, type){
    try {
        const res = await fs.promises.readFile(pathRequire.resolve(pathName))
        let result
        switch (type) {
            case "buffer":
                result = res
                break
            case "json":
                result = JSON.parse(res.toString())
                break
            case "base64":
                result = new Buffer(res).toString("base64")
                break
            default:
                result = res.toString()
                break
        }
        return result
    } catch (e) {
        return null
    }
}