import FilesAPI from "../libs/FilesAPI"
import RegistryAPI from "../libs/RegistryAPI";
import SelectionStore from "../stores/SelectionStore";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import EntityAPI from "../../public/engine/api/EntityAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {

    const found = entity.scripts.findIndex(s => s.id === scriptID)
    const reg = RegistryAPI.getRegistryEntry(scriptID)

    if (!reg) {

        if (found > -1) {
            entity.scripts[found] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        }
        if (autoUpdate)
            SelectionStore.updateStore()

        return
    }

    const data = await FilesAPI.readFile(NodeFS.ASSETS_PATH + NodeFS.sep + reg.path)

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