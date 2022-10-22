const fs = require("fs");
const path = require("path");
export default function createDirectory(p){
    try {
        fs.mkdirSync(path.resolve(p))
    } catch (e) {
        console.error(e)
    }
}