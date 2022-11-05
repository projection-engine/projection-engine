import FilesAPI from "../libs/FilesAPI"
import RegistryAPI from "../libs/RegistryAPI";
import SelectionStore from "../stores/SelectionStore";
import NodeFS from "shared-resources/frontend/libs/NodeFS";
import EntityAPI from "../../public/engine/api/EntityAPI";
import ScriptsAPI from "../../public/engine/api/ScriptsAPI";

export default async function componentConstructor(entity, scriptID, autoUpdate = true) {
    await ScriptsAPI.linkScript(entity, scriptID)
    if (autoUpdate)
        SelectionStore.updateStore()
}