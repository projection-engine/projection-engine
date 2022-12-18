import PROJECT_FOLDER_STRUCTURE from "../../static/objects/PROJECT_FOLDER_STRUCTURE";

const fs = require("fs")
const pathRequire = require("path")

export default async function parseContentBrowserData(p, registryData, projectPath) {
    if (typeof p !== "string")
        return
    const assetsPath = pathRequire.resolve(projectPath + pathRequire.sep + PROJECT_FOLDER_STRUCTURE.ASSETS)
    const stat = await fs.promises.stat(p)
    const split = p.split(pathRequire.sep)

    let parent = [...split]
    parent.pop()

    const parentPath = parent.join(pathRequire.sep).replace(assetsPath, "")
    const currentPath = p.replace(assetsPath, "")

    if (stat.isDirectory())
        return {
            isFolder: true,
            name: [...split].pop(),
            creationDate: (new Date(stat.birthtime)).toDateString(),
            id: currentPath,
            parent: split[split.length - 2] === "assets" ? undefined : parentPath
        }
    const parsedPath = pathRequire.resolve(assetsPath + currentPath).replace(assetsPath + pathRequire.sep, "")

    return {
        isFolder: false,
        name: [...split].pop().split(/\.([a-zA-Z0-9]+)$/)[0],
        type: p.split(".").pop(),
        fileType: "." + p.split(".").pop(),
        creationDate: (new Date(stat.birthtime)).toDateString(),
        id: currentPath,
        size: stat.size,
        registryID: registryData.find(reg => reg.path === parsedPath || reg.path === currentPath)?.id,
        parent: split[split.length - 2] === "assets" ? undefined : parentPath
    }


}