import FileSystem from "../../src/project/utils/files/FileSystem"

const fs = require("fs")
const pathRequire = require('path')

export async function parsePath (p, registryData, path) {
    fs.lstat(p, (e, stat) => {
        if (!e) {
            const split = p.split(FileSystem.sep)
            let parent = [...split]
            parent.pop()

            parent = parent.join(FileSystem.sep ).replace(path, "")
            const currentPath = p.replace(path, "")
            if (stat && stat.isDirectory) {
                return {
                    isFolder: true,
                    name: [...split].pop(),
                    creationDate: new Date(stat.birthtime).toDateString(),
                    id: currentPath,

                    parent: split[split.length - 2] === "assets" ? undefined : parent
                }
            } else {

                const parsedPath = pathRequire.resolve(path + currentPath).replace(path +FileSystem.sep , "")
                return {
                    isFolder: false,
                    name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
                    type: p.split(".").pop(),
                    fileType: "." + p.split(".").pop(),
                    creationDate: new Date(stat.birthtime).toDateString(),
                    id: currentPath,
                    size: stat.size,
                    registryID: registryData.find(reg => {
                        return reg.path === parsedPath || reg.path === currentPath
                    })?.id,
                    parent: split[split.length - 2] === "assets" ? undefined : parent
                }
            }
        }
    }) 
    
}