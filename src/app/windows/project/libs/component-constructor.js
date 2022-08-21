import CBStoreController from "../stores/CBStoreController";
import FilesAPI from "../../../libs/files/FilesAPI"
import RendererStoreController from "../stores/RendererStoreController";
import BundlerAPI from "./engine/libs/apis/BundlerAPI";
import RegistryAPI from "../../../libs/files/RegistryAPI";
import Entity from "./engine/templates/basic/Entity";
import UIStoreController from "../stores/UIStoreController";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    const updateStore = () => {
        if(entity instanceof Entity)
            RendererStoreController.updateEngine()
        else
            UIStoreController.updateStore()
    }
    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = await RegistryAPI.readRegistryFile(scriptID)

    if (!reg) {

        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            updateStore()

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
            updateStore()
        alert.pushAlert("Error loading libs")
        return
    }

    BundlerAPI.linkScript(data, entity, scriptID, reg.path)

    if (autoUpdate)
        updateStore()
}