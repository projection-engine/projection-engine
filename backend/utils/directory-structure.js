const fs = require("fs");
const path = require("path");


export default async function  directoryStructure(d){
    const dir = path.resolve(d)
    const results = []
    if (fs.existsSync(dir)) {
        const list = await fs.promises.readdir(dir)
        if (!list) return []
        let pending = list.length
        if (!pending) return results
        for (let i = 0; i < list.length; i++) {
            let file = path.resolve(dir, list[i])
            const stat = await fs.promises.stat(file)
            results.push(file)
            if (stat && stat.isDirectory()) {
                results.push(...(await directoryStructure(file)))
                if (!--pending) return results
            } else if (!--pending) return results
        }
    }
    return []
}

