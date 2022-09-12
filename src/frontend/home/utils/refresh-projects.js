import Localization from "../../shared/libs/Localization";

import FilesAPI from "../../shared/libs/files/FilesAPI";
import NodeFS from "../../shared/libs/NodeFS";


export default async function refreshProjects(path) {
    const [e, res] = await NodeFS.readdir(path)
    if (!(await NodeFS.exists(path))) await NodeFS.mkdir(path)

    if (!e) {
        const data = []
        for (let i in res) {
            const f = res[i]
            let filename = path + f
            const [, stat] = await NodeFS.lstat(filename)
            if (stat && stat.isDirectory) {
                const [, meta] = await NodeFS.read(filename + "/.meta")
                const [, settings] = await NodeFS.read(filename + "/.preferences")
                const parts = filename.split(FilesAPI.sep)
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