import MutableObject from "../../engine-core/MutableObject";
import * as fs from "fs";
import * as pathRequire from "path";

export default async function readTypedFile(pathName, type): Promise<undefined | { [key: string|number|symbol]: any } | Buffer | string | null> {
    try {
        const res:Buffer = await fs.promises.readFile(pathRequire.resolve(pathName))
        let result: undefined | MutableObject | Buffer | string | null
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
        console.error(e)
        return null
    }
}