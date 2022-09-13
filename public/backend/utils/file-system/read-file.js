const path = require("path");
const fs = require("fs");


module.exports = async function readFile(p, options) {
    return await new Promise(resolve => {
        fs.readFile(path.resolve(p), options, (err, res) => resolve([err, res ? res.toString() : undefined]))
    })
}