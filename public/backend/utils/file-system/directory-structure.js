const fs = require("fs");
const path = require("path");
const readdir = require("./readdir");
const lstat = require("./lstat");


module.exports = async function directoryStructure(dir){
    let results = []
    if (fs.existsSync(dir)) {
        const [err, list] = await readdir(dir)
        if (err) return []
        let pending = list.length
        if (!pending) return results
        for (let i in list) {
            let file = path.resolve(dir, list[i])
            const stat = (await lstat(file))[1]
            results.push(file)
            if (stat && stat.isDirectory) {
                const res = await directoryStructure(file)
                results = results.concat(res)
                if (!--pending) return results
            } else if (!--pending) return results
        }
    }
    return []
}

