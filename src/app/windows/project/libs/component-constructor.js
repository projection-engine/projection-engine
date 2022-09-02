import CBStoreController from "../stores/CBStoreController";
import FilesAPI from "../../../libs/files/FilesAPI"
import RendererStoreController from "../stores/RendererStoreController";
import BundlerAPI from "./engine/production/libs/BundlerAPI";
import RegistryAPI from "../../../libs/files/RegistryAPI";
import Entity from "./engine/production/templates/Entity";
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

        alert.pushAlert("Error loading data")
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
        alert.pushAlert("Error loading data")
        return
    }

    const result = BundlerAPI.linkScript(data, entity, scriptID, reg.path)
    if(!result)
        alert.pushAlert("Error loading data")
    if (autoUpdate)
        updateStore()
}