import FS from "../../../lib/FS/FS";
import PROJECT_STATIC_DATA from "../../../../static/objects/PROJECT_STATIC_DATA";
import LOCALIZATION_EN from "../../editor/static/LOCALIZATION_EN";

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
        const metadata = children.find(c => c.includes(PROJECT_STATIC_DATA.PROJECT_FILE_EXTENSION))

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