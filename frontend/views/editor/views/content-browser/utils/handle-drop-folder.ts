import FilesStore from "../../../stores/FilesStore";
import RegistryAPI from "../../../lib/fs/RegistryAPI";
import ContentBrowserAPI from "../../../lib/fs/ContentBrowserAPI";
import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
import FS from "../../../../../lib/FS/FS";
import AlertController from "../../../../../components/alert/AlertController";


export default async function handleDropFolder(event:string[]|string, target?:string) {
    try {
        const items = Array.isArray(event) ? event : JSON.parse(event)
        for (let i = 0; i < items.length; i++) {
            const textData = items[i]

            if (target !== FS.sep) {
                let from = textData
                if (!from.includes(FS.sep)) {
                    const reg = RegistryAPI.getRegistryEntry(from)
                    if (reg) from = reg.path
                    else {
                        console.error("Some error occurred")
                        return
                    }
                }
                const to = target + FS.sep + from.split(FS.sep).pop()

                const toItem = FilesStore.data.items.find(f => f.id === target)
                const fromItem = FilesStore.data.items.find(f => f.id === from || (f.registryID === textData && f.registryID !== undefined))
                if (from !== to && toItem && toItem.id !== from && fromItem && fromItem.parent !== to && toItem.isFolder) {
                    await ContentBrowserAPI.rename(FS.resolvePath(FS.ASSETS_PATH + FS.sep + from), FS.resolvePath(FS.ASSETS_PATH + FS.sep + to))
                    await FilesStore.refreshFiles()
                }
            } else if (textData.includes(FS.sep)) {
                const newPath = FS.ASSETS_PATH + FS.sep + textData.split(FS.sep).pop()
                if (!FS.exists(newPath)) {
                    await ContentBrowserAPI.rename(FS.resolvePath(FS.ASSETS_PATH + FS.sep + textData), FS.resolvePath(newPath))
                    await FilesStore.refreshFiles()
                } else AlertController.error(LOCALIZATION_EN.ITEM_ALREADY_EXISTS)
            }
        }
    } catch (error) {
        console.error(error)
    }
}