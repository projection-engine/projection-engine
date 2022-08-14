import FileStoreController from "../stores/FileStoreController";
import FilesAPI from "../../../data/files/FilesAPI"
import DataStoreController from "../stores/DataStoreController";
import Packager from "./engine/libs/builder/Packager";
import RegistryAPI from "../../../data/files/RegistryAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = await RegistryAPI.readRegistryFile(scriptID)

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

    const data = await FilesAPI.readFile(FileStoreController.ASSETS_PATH + FilesAPI.sep + reg.path)
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

    Packager.linkScript(data, entity, scriptID, reg.path)

    if (autoUpdate)
        DataStoreController.updateEngine()
}