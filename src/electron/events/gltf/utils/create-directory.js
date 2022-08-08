const fs = require("fs");
const path = require("path");
module.exports = function createDirectory(p){
    try {
        fs.mkdirSync(path.resolve(p))
    } catch (e) {
        console.error(e)
    }
}