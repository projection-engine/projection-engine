import NodeFS from "../../../../../data/NodeFS"
import FilesAPI from "../../../../../data/files/FilesAPI"
import FileStoreController from "../../../stores/FileStoreController";
import Localization from "../../../../../data/Localization";
import ContentBrowserAPI from "../../../../../data/files/ContentBrowserAPI";

export default async function onCreate(parent) {
    const directories = await ContentBrowserAPI.foldersFromDirectory(FileStoreController.ASSETS_PATH + parent)
    const NEW_FOLDER = Localization.PROJECT.FILES.NEW_FOLDER
    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FilesAPI.sep )[d.split(FilesAPI.sep).length - 1].includes(NEW_FOLDER)
        }).length
        let newID = id
        if (index > 0)
            newID += " - " + index

        while ((await NodeFS.exists(FileStoreController.ASSETS_PATH + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FilesAPI.sep + NEW_FOLDER)
    const [e] = await NodeFS.mkdir(FileStoreController.ASSETS_PATH + id)
    if (!e)
        FileStoreController.refreshFiles().catch()
}