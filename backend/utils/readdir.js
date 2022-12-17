const fs = require("fs");
const path = require("path");
export default async function readdir(p, options) {
    let response, error
    try {
        response = await fs.promises.readdir(path.resolve(p), options)
    } catch (err) {
        error = err
    }
    return [error, response]
}