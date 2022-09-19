import FilesStore from "../stores/FilesStore";
import FilesAPI from "../../shared/libs/files/FilesAPI"
import RegistryAPI from "../../shared/libs/files/RegistryAPI";
import SelectionStore from "../stores/SelectionStore";
import Localization from "../../shared/libs/Localization";
import {EntityAPI} from "../../../public/engine/production";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {

    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = await RegistryAPI.readRegistryFile(scriptID)

    if (!reg) {

        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            SelectionStore.updateStore()

        return
    }

    const data = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path)

    if (!data) {
        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            SelectionStore.updateStore()
        return
    }

    EntityAPI.linkScript(data, entity, scriptID, reg.path)
    if (autoUpdate)
        SelectionStore.updateStore()
}