const fs = require("fs");
const path = require("path");
module.exports = async function (p, options) {
    return await new Promise(resolve => {
        fs.readdir(path.resolve(p), options, (err, res) => resolve([err, res]))
    })
}