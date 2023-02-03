import * as fs from "fs";
import * as path from "path";

export default async function rm(p, options) {
    let error
    try {
        await fs.promises.rm(path.resolve(p), options)
    } catch (err) {
        error = err
    }
    return [error]
}
