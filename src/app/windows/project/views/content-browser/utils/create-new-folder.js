import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"
import FileStoreController from "../../../stores/FileStoreController";

export default async function onCreate(parent) {
    const directories = await window.fileSystem.foldersFromDirectory(hook.path + parent)
    const NEW_FOLDER = window.localization.translate("PROJECT", "FILES", "NEW_FOLDER")
    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FileSystem.sep )[d.split(FileSystem.sep).length - 1].includes(NEW_FOLDER)
        }).length
        let newID = id
        if (index > 0)
            newID += " - " + index

        while ((await AsyncFS.exists(FileStoreController.ASSETS_PATH + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FileSystem.sep + NEW_FOLDER)
    const [e] = await AsyncFS.mkdir(FileStoreController.ASSETS_PATH + id)
    if (!e)
        FileStoreController.refreshFiles().catch()
}