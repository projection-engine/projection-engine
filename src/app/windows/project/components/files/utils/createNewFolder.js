import AsyncFS from "../../../libs/AsyncFS"
import FileSystem from "../../../libs/FileSystem"

export default async function onCreate(parent, hook) {
    const directories = await window.fileSystem.foldersFromDirectory(hook.path + parent)
    const NEW_FOLDER = window.localization.translate("PROJECT", "FILES", "NEW_FOLDER")
    const getName = async (id) => {
        const index = directories.filter(d => {
            return d.split(FileSystem.sep )[d.split(FileSystem.sep).length - 1].includes(NEW_FOLDER)
        }).length
        let newID = id
        if (index > 0)
            newID += " - " + index

        while ((await AsyncFS.exists(hook.path + newID))) {
            newID = await getName(newID)
        }
        return newID
    }

    let id = getName(parent + FileSystem.sep + NEW_FOLDER)
    const [e] = await AsyncFS.mkdir(hook.path + id)
    if (!e)
        hook.refreshFiles().catch()
}