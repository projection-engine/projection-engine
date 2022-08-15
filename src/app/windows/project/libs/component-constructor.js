import CBStoreController from "../stores/CBStoreController";
import FilesAPI from "../../../libs/files/FilesAPI"
import RendererStoreController from "../stores/RendererStoreController";
import Packager from "./engine/libs/builder/Packager";
import RegistryAPI from "../../../libs/files/RegistryAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = await RegistryAPI.readRegistryFile(scriptID)

    if (!reg) {

        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            RendererStoreController.updateEngine()

        alert.pushAlert("Error loading libs")
        return
    }

    const data = await FilesAPI.readFile(CBStoreController.ASSETS_PATH + FilesAPI.sep + reg.path)
    if (!data) {
        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            RendererStoreController.updateEngine()
        alert.pushAlert("Error loading libs")
        return
    }

    Packager.linkScript(data, entity, scriptID, reg.path)

    if (autoUpdate)
        RendererStoreController.updateEngine()
}