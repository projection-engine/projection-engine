import Localization from "../../../libs/Localization";

import FileSystem from "../../../libs/FileSystem";
import AsyncFS from "../../../libs/AsyncFS";


export default async function refreshProjects(path) {
    const [e, res] = await AsyncFS.readdir(path)
    if (!(await AsyncFS.exists(path))) await AsyncFS.mkdir(path)

    if (!e) {
        const data = []
        for (let i in res) {
            const f = res[i]
            let filename = path + f
            const [, stat] = await AsyncFS.lstat(filename)
            if (stat && stat.isDirectory) {
                const [, meta] = await AsyncFS.read(filename + "/.meta")
                const [, settings] = await AsyncFS.read(filename + "/.settings")
                const parts = filename.split(FileSystem.sep)
                data.push({
                    id: parts.pop(),
                    meta: meta ? JSON.parse(meta) : undefined,
                    settings: settings ? JSON.parse(settings) : undefined
                })
            }
        }
        return data.filter(e => e !== undefined).map(e => {
            let res = {...e}
            if (!res.meta) res.meta = {name: Localization.HOME.HOME.CREATE}
            if (!res.settings) res.settings = {}
            if (!res.meta.name) res.meta.name = Localization.HOME.HOME.CREATE
            return res
        })
    }
    return []
}