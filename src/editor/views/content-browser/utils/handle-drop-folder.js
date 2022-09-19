import NodeFS from "../../../../shared/libs/NodeFS"
import FilesAPI from "../../../../shared/libs/files/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import RegistryAPI from "../../../../shared/libs/files/RegistryAPI";
import ContentBrowserAPI from "../../../../shared/libs/files/ContentBrowserAPI";


export default async function handleDropFolder(event, target) {
    try {
        const items = Array.isArray(event) ? event : JSON.parse(event)
        for (let i = 0; i < items.length; i++) {
            const textData = items[i]

            if (target !== FilesAPI.sep) {
                let from = textData
                if (!from.includes(FilesAPI.sep)) {
                    const reg = await RegistryAPI.readRegistryFile(from)
                    if (reg) from = reg.path
                    else {
                        alert.pushAlert("Could not find file.", "error")
                        return
                    }
                }
                const to = target + FilesAPI.sep + from.split(FilesAPI.sep).pop()

                const toItem = FilesStore.data.items.find(f => f.id === target)
                const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
                if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                    const error = await ContentBrowserAPI.rename(FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + from), FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep +to))

                    await FilesStore.refreshFiles()
                }
            } else if (textData.includes(FilesAPI.sep)) {
                const newPath = FilesStore.ASSETS_PATH + FilesAPI.sep + textData.split(FilesAPI.sep).pop()
                if (!(await NodeFS.exists(newPath))) {
                    await ContentBrowserAPI.rename(FilesAPI.resolvePath(FilesStore.ASSETS_PATH + FilesAPI.sep + textData), FilesAPI.resolvePath(newPath))
                    await FilesStore.refreshFiles()
                } else alert.pushAlert("Item already exists.", "error")
            }
        }
    } catch (error) {
        console.error(error)
    }
}