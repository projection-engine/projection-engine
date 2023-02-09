import FS from "../../shared/lib/FS/FS";
import LOCALIZATION_EN from "../../../static/objects/LOCALIZATION_EN";
import FILE_TYPES from "../../../static/objects/FILE_TYPES";

export default async function refreshProjects(path) {

    const res = await FS.readdir(path)
    if (!res)
        return []
    const data = []
    for (let i = 0; i < res.length; i++) {
        const itemPath = path + FS.sep + res[i]
        const stat = await FS.stat(itemPath)

        if(!stat?.isDirectory)
            continue
        const children = await FS.readdir(itemPath)
        if(!children)
            continue
        const metadata = children.find(c => c.includes(FILE_TYPES.PROJECT))

        if(!metadata)
            continue
        const blob = await FS.read(itemPath + FS.sep  + metadata)
        const parts = itemPath.split(FS.sep)
        const parsedMetadata = JSON.parse(blob.toString())

        data.push({
            id: parts.pop(),
            meta: {...parsedMetadata, settings: undefined},
            settings: parsedMetadata?.settings,
            path: itemPath
        })
    }
    return data.filter(e => e !== undefined).map(e => {
        let res = {...e}
        if (!res.meta) res.meta = {name: LOCALIZATION_EN.NEW_PROJECT}
        if (!res.settings) res.settings = {}
        if (!res.meta.name) res.meta.name = LOCALIZATION_EN.CREATE
        return res
    })
}