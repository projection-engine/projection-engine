const path = require("path");
const fs = require("fs");

export default async function readFile(p, options?:any):Promise<[string,any]> {
    let result, error
    try {
        result = await fs.promises.readFile(path.resolve(p), options)
    } catch (err) {
        error = err
    }
    return [error, result ? result.toString() : undefined]
}