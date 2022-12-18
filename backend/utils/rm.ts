const fs = require("fs");
const path = require("path");
export default async function rm(p, options) {
    let error
    try {
        await fs.promises.rm(path.resolve(p), options)
    } catch (err) {
        error = err
    }
    return [error]
}
