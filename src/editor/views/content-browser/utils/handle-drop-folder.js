import NodeFS from "shared-resources/frontend/libs/NodeFS"
import FilesAPI from "../../../../shared/libs/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import RegistryAPI from "../../../../shared/libs/RegistryAPI";
import ContentBrowserAPI from "../../../../shared/libs/ContentBrowserAPI";


export default async function handleDropFolder(event, target) {
    try {
        const items = Array.isArray(event) ? event : JSON.parse(event)
        for (let i = 0; i < items.length; i++) {
            const textData = items[i]

            if (target !== NodeFS.sep) {
                let from = textData
                if (!from.includes(NodeFS.sep)) {
                    const reg = await RegistryAPI.readRegistryFile(from)
                    if (reg) from = reg.path
                    else {
                        alert.pushAlert("Could not find file.", "error")
                        return
                    }
                }
                const to = target + NodeFS.sep + from.split(NodeFS.sep).pop()

                const toItem = FilesStore.data.items.find(f => f.id === target)
                const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
                if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                    await ContentBrowserAPI.rename(NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + from), NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + to))
                    await FilesStore.refreshFiles()
                }
            } else if (textData.includes(NodeFS.sep)) {
                const newPath = NodeFS.ASSETS_PATH  + NodeFS.sep + textData.split(NodeFS.sep).pop()
                if (!(await NodeFS.exists(newPath))) {
                    await ContentBrowserAPI.rename(NodeFS.resolvePath(NodeFS.ASSETS_PATH  + NodeFS.sep + textData), NodeFS.resolvePath(newPath))
                    await FilesStore.refreshFiles()
                } else alert.pushAlert("Item already exists.", "error")
            }
        }
    } catch (error) {
        console.error(error)
    }
}