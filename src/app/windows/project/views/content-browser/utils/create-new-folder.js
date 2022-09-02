import NodeFS from "../../../../../libs/NodeFS"
import FilesAPI from "../../../../../libs/files/FilesAPI"
import FilesStore from "../../../stores/FilesStore";
import Localization from "../../../../../libs/Localization";
import ContentBrowserAPI from "../../../../../libs/files/ContentBrowserAPI";

export default async function onCreate(parent) {
    const directories = await ContentBrowserAPI.foldersFromDirectory(FilesStore.ASSETS_PATH + parent)
    const NEW_FOLDER = Localization.PROJECT.FILES.NEW_FOLDER
    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FilesAPI.sep )[d.split(FilesAPI.sep).length - 1].includes(NEW_FOLDER)
        }).length
        let newID = id
        if (index > 0)
            newID += " - " + index

        while ((await NodeFS.exists(FilesStore.ASSETS_PATH + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FilesAPI.sep + NEW_FOLDER)
    const [e] = await NodeFS.mkdir(FilesStore.ASSETS_PATH + id)
    if (!e)
        FilesStore.refreshFiles().catch()
}