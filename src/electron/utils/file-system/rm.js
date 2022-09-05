const fs = require("fs");
const path = require("path");
module.exports = async function (p, options) {
    return await new Promise(resolve => {
        fs.rm(path.resolve(p), options, (err) => resolve([err]))
    })
}
