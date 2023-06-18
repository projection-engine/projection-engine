import * as pathRequire from "path"
import * as path from "path"
import * as fs from "fs"
import ElectronWindowService from "./ElectronWindowService";
import Folders from "../../shared/Folders";

export default class FileSystemUtil{
    static async createRegistryEntry(fID:string, pathToFile:string) {
        const path = pathToFile.replaceAll(pathRequire.sep + pathRequire.sep, pathRequire.sep)
        try {
            ElectronWindowService.getInstance().registry[fID] = {id: fID, path}
            await fs.promises.writeFile(ElectronWindowService.getInstance().pathToRegistry, JSON.stringify(ElectronWindowService.getInstance().registry))
        } catch (err) {
            console.error(err)
        }
    }

    static async directoryStructure(d){
        const dir = path.resolve(d)
        const results = []
        if (fs.existsSync(dir)) {
            const list = await fs.promises.readdir(dir)
            if (!list) return []
            let pending = list.length
            if (!pending) return results
            for (let i = 0; i < list.length; i++) {
                const file = path.resolve(dir, list[i])
                const stat = await fs.promises.stat(file)
                results.push(file)
                if (stat && stat.isDirectory()) {
                    results.push(...(await FileSystemUtil.directoryStructure(file)))
                    if (!--pending) return results
                } else if (!--pending) return results
            }
        }
        return []
    }

    static async parseContentBrowserData(p, registryData, projectPath) {
        if (typeof p !== "string")
            return
        const assetsPath = pathRequire.resolve(projectPath + pathRequire.sep + Folders.ASSETS)
        const stat = await fs.promises.stat(p)
        const split = p.split(pathRequire.sep)
        const parent = [...split]

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

    static async readTypedFile(pathName, type): Promise<undefined | { [key: string|number|symbol]: any } | Buffer | string | null> {
        try {
            const res:Buffer = await fs.promises.readFile(pathRequire.resolve(pathName))
            let result: undefined | MutableObject | Buffer | string | null
            switch (type) {
                case "buffer":
                    result = res
                    break
                case "json":
                    result = JSON.parse(res.toString())
                    break
                case "base64":
                    result = new Buffer(res).toString("base64")
                    break
                default:
                    result = res.toString()
                    break
            }
            return result
        } catch (e) {
            console.error(e)
            return null
        }
    }
}