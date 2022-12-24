import FilesStore from "../../../stores/FilesStore";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ContentBrowserAPI from "../../../lib/fs/ContentBrowserAPI";
import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
import NodeFS from "../../../../lib/FS/NodeFS";


export default async function handleDropFolder(event:string[]|string, target?:string) {
    try {
        const items = Array.isArray(event) ? event : JSON.parse(event)
        for (let i = 0; i < items.length; i++) {
            const textData = items[i]

            if (target !== NodeFS.sep) {
                let from = textData
                if (!from.includes(NodeFS.sep)) {
                    const reg = RegistryAPI.getRegistryEntry(from)
                    if (reg) from = reg.path
                    else {
                        console.error("Some error occurred")
                        return
                    }
                }
                const to = target + NodeFS.sep + from.split(NodeFS.sep).pop()

                const toItem = FilesStore.data.items.find(f => f.id === target)
                const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
                if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                    await ContentBrowserAPI.rename(NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + from), NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + to))
                    await FilesStore.refreshFiles()
                }
            } else if (textData.includes(NodeFS.sep)) {
                const newPath = NodeFS.ASSETS_PATH + NodeFS.sep + textData.split(NodeFS.sep).pop()
                if (!NodeFS.exists(newPath)) {
                    await ContentBrowserAPI.rename(NodeFS.resolvePath(NodeFS.ASSETS_PATH + NodeFS.sep + textData), NodeFS.resolvePath(newPath))
                    await FilesStore.refreshFiles()
                } else console.error(LOCALIZATION_EN.ITEM_ALREADY_EXISTS)
            }
        }
    } catch (error) {
        console.error(error)
    }
}