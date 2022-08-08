import FileStoreController from "../stores/FileStoreController";
import FileSystem from "../../../libs/FileSystem"
import DataStoreController from "../stores/DataStoreController";
import Packager from "./engine/libs/builder/Packager";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = await window.fileSystem.readRegistryFile(scriptID)

    if (!reg) {

        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            DataStoreController.updateEngine()

        alert.pushAlert("Error loading data")
        return
    }

    const data = await window.fileSystem.readFile(FileStoreController.ASSETS_PATH + FileSystem.sep + reg.path)
    if (!data) {
        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            DataStoreController.updateEngine()
        alert.pushAlert("Error loading data")
        return
    }

    Packager.linkScript(data, entity, scriptID)

    if (autoUpdate)
        DataStoreController.updateEngine()
}